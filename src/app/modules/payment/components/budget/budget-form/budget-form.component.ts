import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Validators } from '@angular/forms';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss']
})
export class BudgetFormComponent implements OnInit, OnDestroy {
  form: FormGroup;

  budget: any;

  loading = true;
  isSending = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.loading = false;
    this.initForm();
  }

  ngOnDestroy() {
    // this.churchDataComponent.closeSidenav();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      year: [null, Validators.required],
      value: [null, Validators.required],
      department: [null, Validators.required]
    });
  }

  public save(): void {

  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar Orçamento' : 'Novo Orçamento';
  }

  private checkIsEdit(): boolean {
    return this.budget !== undefined && this.budget !== null;
  }
}
