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

  form: FormGroup;
  
  public avaliation: Avaliation;  
  public requirements: Requirement[] = new Array<Requirement>();
  public checks: boolean[] = new Array<boolean>();
  public avaliationRequirements: AvaliationRequirement[] = new Array<AvaliationRequirement>();
  
  constructor(
    private store: AvaliationStore,
    private service: TreasuryService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadRequirements();
    this.avaliation = this.store.avaliation;
  }
  
  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      name: [null, Validators.required]
    });
  }

  private loadRequirements() {
    this.service.getRequirements(auth.getCurrentUnit().id).subscribe((data: Requirement[]) => {
      let years = new Array<number>();      
      const year = ((!this.avaliation || this.avaliation.id) == 0 ? new Date().getFullYear() : new Date(this.avaliation.date).getFullYear());
      data.forEach(element => {
        if (new Date(element.date).getFullYear() === year) {
          this.requirements.push(element); //carregando os requisitos
        }
      });
      this.loadAvaliationRequirements();
    });
  }

  private loadAvaliationRequirements() {
    this.service.getAvaliationRequirements(this.avaliation.id).subscribe((data: AvaliationRequirement[]) => {
      this.requirements.forEach(requirement => {
        var avaliationRequirement = data.filter(f => f.id === requirement.id)[0]; //carregando os requisitos já avaliados
        this.setAvalitionRequirement(requirement, avaliationRequirement);
      });
    });
  }

  private setAvalitionRequirement(requirement: Requirement, avaliationRequirement: AvaliationRequirement) {
    if (avaliationRequirement.id === 0) {
      avaliationRequirement = new AvaliationRequirement();
    }

    avaliationRequirement.avaliation = this.avaliation;
    avaliationRequirement.requirement = requirement;
    avaliationRequirement.note = (requirement.id === 0 ? 0 : requirement.score);
    avaliationRequirement.check = requirement.id != 0;

    this.avaliationRequirements.push(avaliationRequirement);
  }

  updateCheck(avaliationRequirement){
    avaliationRequirement.check = !avaliationRequirement.check;
  }

  saveAvaliation() {
    console.log(this.avaliationRequirements);
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
