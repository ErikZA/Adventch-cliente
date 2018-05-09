import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ScholarshipService } from '../../scholarship.service';
import { isEmpty } from 'rxjs/operator/isEmpty';

@Component({
  selector: 'app-pendency',
  templateUrl: './pendency.component.html',
  styleUrls: ['./pendency.component.scss']
})
export class PendencyComponent implements OnInit {

  formPendency: FormGroup;
  isEmpty: true;
  
  constructor(
    private fb: FormBuilder,    
    public dialogRef: MatDialogRef<PendencyComponent>,
    private snackBar: MatSnackBar,
    public scholarshipService: ScholarshipService
  ) { }

  ngOnInit() {
    this.initForm();
    this.checkPendencies();
  }

  initForm() {
    this.formPendency = this.fb.group({
      pendency: [null, Validators.required],
    });
  }

  checkPendencies(){
    this.formPendency.setValue({
      pendency: this.scholarshipService.processSelected[0].pendency      
    });
  }

  savePendency() {
    if (this.formPendency.invalid) 
      return;
    if (this.formPendency.valid) {
      this.scholarshipService.savePendency(this.formPendency.value.pendency).subscribe(() =>{
        this.cancel()
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar pendência, tente novamente.', 'OK', { duration: 5000 });
        this.cancel();
      });
    }else{
      return;
    }
  }

  cancel() {
     this.dialogRef.close(false);
  }

  isValid(){
    if(this.formPendency.value.pendency.trim() == '')
      this.formPendency.controls['pendency'].setErrors({'invalid': true});
    return this.formPendency.value.pendency.trim() == '';
  }
}
