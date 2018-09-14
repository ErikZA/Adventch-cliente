import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Process } from '../../../models/process';

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.scss']
})
export class VacancyComponent implements OnInit {

  public formVacancy: FormGroup;
  private process: Process;

  value: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VacancyComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.process = data.process;
  }

  ngOnInit() {
    this.initForm();
    this.value = this.process.bagPorcentage === 50 ? '1' : '2';
  }

  private initForm(): void {
    const valueBagPorcentage = this.process.status === 6 ? '2' : '1';
    this.formVacancy = this.fb.group({
      type: [valueBagPorcentage, Validators.required],
      dateRegistration: [this.process.dateRegistration || new Date(), Validators.required]
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
