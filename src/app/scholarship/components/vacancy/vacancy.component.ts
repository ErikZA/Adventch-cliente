import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ScholarshipService } from '../../scholarship.service';

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.scss']
})
export class VacancyComponent implements OnInit {

  formVacancy: FormGroup;
  
  constructor(
    private fb: FormBuilder,  
    public dialogRef: MatDialogRef<VacancyComponent>,
    private snackBar: MatSnackBar,
    public scholarshipService: ScholarshipService
  ) { }

  ngOnInit() {
    this.initForm();
    this.setDefaultValue();
  }

  initForm() {
    this.formVacancy = this.fb.group({
      type: [null, Validators.required],
      dateRegistration: [null, Validators.required]
    });
  }

  setDefaultValue(){
    this.formVacancy.setValue({
      dateRegistration: new Date(),
      type: "1"
    });
  }

  saveType(){
    if (this.formVacancy.invalid) 
      return;
    var isHalf = this.formVacancy.value.type == "1";
    this.scholarshipService.saveVacancy(this.formVacancy.value.dateRegistration, (isHalf ? 5 : 6), 'Bolsa concedida (' + (isHalf ? '50%' : '100%') + ')').subscribe(() =>{
      this.cancel()
    }, err => {
      this.snackBar.open('Erro ao salvar os dados do processo, tente novamente.', 'OK', { duration: 5000 });
      this.cancel();
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

}
