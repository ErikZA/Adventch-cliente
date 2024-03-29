import {Component, OnInit, OnDestroy, ViewChildren, ViewChild, Input} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observation } from '../../../../models/observation';
import { TreasuryService } from '../../../../treasury.service';
import {ChurchAvaliationFormInterface} from '../../../../interfaces/avaliation/church-avaliation-form-interface';
import {auth} from '../../../../../../auth/auth';
import {EObservationStatus} from '../../../../models/enums';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-avaliation-observation-form',
  templateUrl: './avaliation-observation-form.component.html',
  styleUrls: ['./avaliation-observation-form.component.scss']
})

@AutoUnsubscribe()
export class AvaliationObservationFormComponent implements OnInit, OnDestroy {

  formObservation: FormGroup;
  observation: Observation;
  loading = true;
  isSending = false;
  isValid = true;

  @Input()
  church: ChurchAvaliationFormInterface;
  @Input()
  formAvaliation: FormGroup;
  @Input()
  requeriment: number;
  @Input()
  indice: number;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private treasuryService: TreasuryService) { }


  ngOnInit() {
    this.initForm();
  }


  ngOnDestroy() {
  }

  initForm(): void {
    this.formObservation = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      church: [null],
      date: [null]
    });
  }

  public checkIsLoading(): boolean {
    if((this.church !== undefined && this.church !== null) &&  (this.formAvaliation !== undefined && this.formAvaliation !== null)){
      return this.loading = false;
    } else {
      return true;
    }
  }

   saveObservation() {
     if (!this.formObservation.valid) {
       return;
     }
     this.formObservation.setValue({date: this.formAvaliation.get('date').value,
     church: this.church.id, description: this.formObservation.get('description').value});
     console.log(this.formObservation.value);
     const unit = auth.getCurrentUnit();
     const responsible = auth.getCurrentUser();
     this.isSending = true;
     console.log(...this.formObservation.value);
     const data = {
       id: !!this.observation ? this.observation.id : 0,
       idRequeriment: this.requeriment,
       idWeek: this.indice,
       responsible: responsible.id,
       unit: unit.id,
       status: EObservationStatus.Open,
       ...this.formObservation.value
     };
     this.treasuryService
       .saveRequirementObservation(data)
       .pipe(
         tap(() => {
           this.isSending = false;
           this.formObservation.markAsUntouched();
         }),
         tap(() => this.snackBar.open('Observação armazenado com sucesso!', 'OK', { duration: 5000 }))
       ).subscribe(() => { }, error => {
       console.log(error);
       this.snackBar.open('Erro ao salvar observação, tente novamente.', 'OK', { duration: 5000 });
     });
     this.closeObservation();
   }

   private closeObservation() {
      this.isValid = false;
   }
}
