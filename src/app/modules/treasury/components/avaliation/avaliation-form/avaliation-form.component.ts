import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AvaliationStore } from '../avaliation.store';
import { Avaliation } from '../../../models/avaliation';
import { TreasuryService } from '../../../treasury.service';
import { Requirement } from '../../../models/requirement';
import { auth } from '../../../../../auth/auth';
import { AvaliationRequirement } from '../../../models/avaliationRequirement';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-avaliation-form',
  templateUrl: './avaliation-form.component.html',
  styleUrls: ['./avaliation-form.component.scss']
})

export class AvaliationFormComponent implements OnInit, OnDestroy {
  subscribeUnit: Subscription;
  isSending = false;

  form: FormGroup;
  total: number = 0;

  public avaliation: Avaliation;
  public requirements: Requirement[] = new Array<Requirement>();
  public checks: boolean[] = new Array<boolean>();
  public avaliationRequirements: AvaliationRequirement[] = new Array<AvaliationRequirement>();

  constructor(
    public store: AvaliationStore,
    private service: TreasuryService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadAvaliation();
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      date: [new Date(), Validators.required]
    });
  }

  private loadAvaliation(): void {
    if (this.store.isMensal) {
      this.avaliation = this.store.avaliation;
      this.loadRequirements();
    } else {
      this.service.getAnualAvaliation(this.store.avaliation.church.id, new Date().getFullYear()).subscribe((data: Avaliation) => {
        this.avaliation = data;
        this.loadRequirements();
      });
    }
  }

  private loadRequirements() {
    this.service.getRequirements(auth.getCurrentUnit().id).subscribe((data: Requirement[]) => {
      let year = new Date().getFullYear();
      if (this.avaliation) {
        year = new Date(this.avaliation.date).getFullYear();
      }
      data.forEach(element => {
        if (this.store.isMensal) {
          this.loadMensalRequirements(element, year);
        } else {
          this.loadAnualRequirements(element, year);
        }
      });
      this.loadAvaliationRequirements();
    });
  }

  private loadMensalRequirements(requirement: Requirement, year: number) {
    if (!requirement.isAnual) {
      if (new Date(requirement.date).getFullYear() === year) {
        this.requirements.push(requirement);
      }
    }
  }

  private loadAnualRequirements(requirement: Requirement, year: number) {
    if (requirement.isAnual) {
      if (new Date(requirement.date).getFullYear() === year) {
        this.requirements.push(requirement);
      }
    }
  }

  private loadAvaliationRequirements() {
    this.service.getAvaliationRequirements(!this.avaliation ? 0 : this.avaliation.id).subscribe((data: AvaliationRequirement[]) => {
      this.requirements.forEach(requirement => {
        var avaliationRequirement = data.filter(f => f.id === requirement.id)[0]; //carregando os requisitos já avaliados
        this.setAvalitionRequirement(requirement, avaliationRequirement);
      });
    });
  }

  private setAvalitionRequirement(requirement: Requirement, avaliationRequirement: AvaliationRequirement) {
    if (avaliationRequirement == undefined || avaliationRequirement.id === 0) {
      avaliationRequirement = new AvaliationRequirement();
    }

    avaliationRequirement.avaliation = this.avaliation;
    avaliationRequirement.requirement = requirement;
    avaliationRequirement.note = (requirement.id === 0 ? 0 : requirement.score);
    avaliationRequirement.check = requirement.id != 0;

    this.avaliationRequirements.push(avaliationRequirement);
    this.updateTotal(avaliationRequirement.check, requirement.score);
  }

  private updateTotal(check: boolean, note: number): void {
    if (check) {
      this.total += note;
    } else {
      this.total -= note;
    }
  }

  updateCheck(avaliationRequirement: AvaliationRequirement): void {
    avaliationRequirement.check = !avaliationRequirement.check;
    this.updateNote(avaliationRequirement);
  }

  private updateNote(avaliationRequirement: AvaliationRequirement): void {
    let requirement = this.requirements.filter(f => f.id === avaliationRequirement.requirement.id)[0];
    avaliationRequirement.note = avaliationRequirement.check ? requirement.score : 0;
    this.updateTotal(avaliationRequirement.check, requirement.score);
  }

  saveAvaliation(): void {
    this.isSending = true;
    if (this.form.valid) {
      this.sendData();
    }
    this.isSending = false;
  }

  private sendData(): void {
    const data = {
      id: !this.avaliation ? 0 : this.store.avaliation.id,
      date: new Date(),
      dateArrival: new Date(this.form.get('date').value),
      idChurch: this.store.avaliation.church.id,
      IdStatus: 1,
      IdUnit: auth.getCurrentUnit().id,
      IdUser: auth.getCurrentUser().id,
      isMensal: this.store.isMensal,
      AvaliationRequirements: this.avaliationRequirements
    };
    this.store.save(data);
  }

  closeSidenav() {
    //this.treasureService.setDistrict(new Districts());
    //this.sidenavService.close();
  }

  public getTitleLabel() {
    if (!this.store.isMensal) {
      return "ANUAL";
    }

    let date = new Date(this.avaliation.date);
    if (this.avaliation.id === 0) {
      date = new Date();
      this.avaliation.date = date;
    }
    return date.getMonth() + "/" + date.getFullYear();
  }
}
