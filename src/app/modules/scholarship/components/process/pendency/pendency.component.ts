import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { ScholarshipService } from '../../../scholarship.service';

import { Process } from '../../../models/process';

@Component({
  selector: 'app-pendency',
  templateUrl: './pendency.component.html',
  styleUrls: ['./pendency.component.scss']
})
export class PendencyComponent implements OnInit {

  formPendency: FormGroup;
  process: Process;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PendencyComponent>,
    private snackBar: MatSnackBar,
    public scholarshipService: ScholarshipService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.process = data.process;
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.formPendency = this.fb.group({
      pendency: [this.process.pendency, Validators.required],
    });
  }

  public savePendency() {
    if (this.formPendency.valid) {
      this.dialogRef.close(this.formPendency.value);
    } else {
      return;
    }
  }

  public cancel(): void {
     this.dialogRef.close(null);
  }

  public isValid() {
    if (this.formPendency.value.pendency.trim() === '') {
      this.formPendency.controls['pendency'].setErrors({'invalid': true});
    }
    return this.formPendency.value.pendency.trim() === '';
  }
}
