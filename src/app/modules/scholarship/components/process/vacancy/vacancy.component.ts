import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Process } from '../../../models/process';
import { ScholarshipService } from '../../../scholarship.service';
import { ShiftInterface } from '../../../interfaces/shift-interface';
import { Observable } from 'rxjs';
import { auth } from '../../../../../auth/auth';


@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.scss']
})
export class VacancyComponent implements OnInit {

  public formVacancy: FormGroup;
  private process: Process;
  shifts$: Observable<ShiftInterface[]>;
  value: string;
  idUnit: number;

  constructor(
    private service: ScholarshipService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VacancyComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.process = data.process;
  }

  ngOnInit() {
    this.getCurrentUnit();
    this.getShifts();
    this.initForm();
    this.value = this.process.bagPorcentage === 50 ? '1' : '2';
  }

  private getShifts(): void {
    this.shifts$ = this.service.getAllShifts();
  }

  private getCurrentUnit(): void {
    const { id } = auth.getCurrentUnit();
    this.idUnit = id;
  }

  private initForm(): void {
    const valueBagPorcentage = this.process.status === 6 ? '2' : '1';
    this.formVacancy = this.fb.group({
      type: [valueBagPorcentage, Validators.required],
      dateRegistration: [this.process.dateRegistration || new Date(), Validators.required],
      shiftId: null
    });
  }

  public saveType(): void {
    if (this.formVacancy.valid) {
      const isHalf = this.formVacancy.value.type === '1';
      this.formVacancy.value.idStatus = (isHalf ? 5 : 6);
      this.formVacancy.value.description = 'Bolsa concedida (' + (isHalf ? '50%' : '100%') + ')';
      this.dialogRef.close(this.formVacancy.value);
    } else {
      return;
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
