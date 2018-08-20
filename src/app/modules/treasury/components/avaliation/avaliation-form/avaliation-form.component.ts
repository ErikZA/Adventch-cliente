import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AvaliationStore } from '../avaliation.store';
import { Avaliation } from '../../../models/avaliation';
import { TreasuryService } from '../../../treasury.service';
import { Requirement } from '../../../models/requirement';
import { auth } from '../../../../../auth/auth';

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
      const year = new Date(this.avaliation.date).getFullYear();
      data.forEach(element => {
        if (new Date(element.date).getFullYear() === year) {
          this.requirements.push(element);
        }
      });
    });
  }

  private createIRequirement(requirement: Requirement) {
    return {
      name: requirement.name,
      score: requirement.score,
      note: 0
    }
  }

  saveAvaliation() {

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
