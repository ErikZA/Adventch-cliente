import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { SidenavService } from '../../../../../core/services/sidenav.service';
import { AvaliationStore } from '../avaliation.store';
import { Avaliation } from '../../../models/avaliation';
import { TreasuryService } from '../../../treasury.service';
import { Requirement } from '../../../models/requirement';
import { auth } from '../../../../../auth/auth';
import { AvaliationRequirement } from '../../../models/avaliationRequirement';
import { forEach } from '@angular/router/src/utils/collection';
import { Church } from '../../../models/church';

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
    private formBuilder: FormBuilder,
    private sidenavService: SidenavService
  ) { }

  ngOnInit() {
    this.reset();
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

  reset(): void {
    this.avaliation = new Avaliation();
    this.requirements = new Array<Requirement>();
    this.checks = new Array<boolean>();
    this.avaliationRequirements = new Array<AvaliationRequirement>();
  }

  private loadAvaliation(): void {
    if (this.store.isMensal) {
      this.avaliation = this.store.avaliation;
      this.loadRequirements();
      this.setValue();
    } else {
      var churchId = this.store.churchAvaliation.church.id;
      this.service.getAnualAvaliation(churchId, new Date().getFullYear()).subscribe((data: Avaliation) => {
        this.avaliation = data;
        if (!this.avaliation) {
          this.avaliation = new Avaliation();
          this.avaliation.id = 0;
          this.avaliation.church = !this.store.avaliation ? new Church() : this.store.avaliation.church;
        }
        this.loadRequirements();
        this.setValue();
      });
    }
  }

  private setValue(){
    if (this.avaliation.id) {
      this.form = new FormGroup({
        date: new FormControl({value: this.avaliation.dateArrival, disabled: false}, Validators.required),
      });
    }
  }

  private loadRequirements() {
    this.service.getRequirements(auth.getCurrentUnit().id).subscribe((data: Requirement[]) => {
      data.forEach(element => {
        if (this.store.isMensal) {
          this.loadMensalRequirements(element);
        } else {
          this.loadAnualRequirements(element);
        }
      });
      this.loadAvaliationRequirements();
    });
  }

  private loadMensalRequirements(requirement: Requirement) {
    if (!requirement.isAnual) {
      if (new Date(requirement.date).getFullYear() === this.store.period.getFullYear()) {
        this.requirements.push(requirement);
      }
    }
  }

  private loadAnualRequirements(requirement: Requirement) {
    if (requirement.isAnual) {
      if (new Date(requirement.date).getFullYear() === this.store.period.getFullYear()) {
        this.requirements.push(requirement);
      }
    }
  }

  private loadAvaliationRequirements() {
    this.service.getAvaliationRequirements(!this.avaliation.id ? 0 : this.avaliation.id).subscribe((data: AvaliationRequirement[]) => {
      this.requirements.forEach(requirement => {
        var avaliationRequirement = data.filter(f => f.requirement.id === requirement.id)[0]; //carregando os requisitos já avaliados
        this.setAvalitionRequirement(requirement, avaliationRequirement);
      });
    });
  }

  private setAvalitionRequirement(requirement: Requirement, avaliationRequirement: AvaliationRequirement) {
    if (avaliationRequirement == undefined || avaliationRequirement.id === 0) {
      avaliationRequirement = new AvaliationRequirement();
      avaliationRequirement.note = requirement.score;
    }

    avaliationRequirement.avaliation = this.avaliation;
    avaliationRequirement.requirement = requirement;
    avaliationRequirement.check = avaliationRequirement.note != 0;

    this.avaliationRequirements.push(avaliationRequirement);
    this.updateTotal(avaliationRequirement.check, avaliationRequirement.note);
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
      id: this.avaliation.id,
      date: this.store.period,
      dateArrival: new Date(this.form.get('date').value),
      idChurch: this.store.churchAvaliation.church.id,
      IdStatus: 1,
      IdUnit: auth.getCurrentUnit().id,
      IdUser: auth.getCurrentUser().id,
      isMensal: this.store.isMensal,
      AvaliationRequirements: this.avaliationRequirements
    };
    this.store.save(data);
  }

  closeSidenav() {
    this.store.avaliation = new Avaliation();
    this.sidenavService.close();
  }

  public getTitleLabel() {
    if (!this.store.isMensal) {
      return "ANUAL";
    }

    let date = new Date(this.store.period);  
    return date.getMonth() + 1 + "/" + date.getFullYear();
  }
}
