import {Component, OnInit, OnDestroy, ViewChildren, ViewChild, Input} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material';

import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Church } from '../../../../models/church';
import { Observation } from '../../../../models/observation';
import { TreasuryService } from '../../../../treasury.service';
import { ObservationDataComponent } from '../../../observation/observation-data/observation-data.component';
import {AvaliationFormComponent} from "../avaliation-form/avaliation-form.component";
import {ChurchAvaliationFormInterface} from "../../../../interfaces/avaliation/church-avaliation-form-interface";


@Component({
  selector: 'app-avaliation-observation-form',
  templateUrl: './avaliation-observation-form.component.html',
  styleUrls: ['./avaliation-observation-form.component.scss']
})

@AutoUnsubscribe()
export class AvaliationObservationFormComponent implements OnInit, OnDestroy {

  @ViewChild(AvaliationFormComponent)
  avaliationFormComponente: AvaliationFormComponent;

  formObservation: FormGroup;
  observation: Observation;
  loading = true;

  @Input()
  church: ChurchAvaliationFormInterface;
  @Input()
  formAvaliation: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: TreasuryService,
    private snackBar: MatSnackBar,
    private treasuryService: TreasuryService,
    private observationDataComponent: ObservationDataComponent
  ) {
  }


  ngOnInit() {
    this.initForm();
     this.observationDataComponent.openSidenav();
  }


  ngOnDestroy() {
  }

  initForm(): void {
    this.formObservation = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private checkIsLoading(): boolean {
    if((this.church !== undefined && this.church !== null) &&  (this.formAvaliation !== undefined && this.formAvaliation !== null))
      return this.loading =false;
    else
      return true;
  }

   saveObservation() {

   }

   private closeObservation(){
   }
    private getChurchAndDate(){
    //return this.avaliationFormComponente.getChurchAndDate();
   }
}
