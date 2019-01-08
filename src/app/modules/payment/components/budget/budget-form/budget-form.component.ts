import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Validators } from '@angular/forms';
import { OnDestroy } from '@angular/core';

import { tap } from 'rxjs/internal/operators/tap';

import { PaymentService } from '../../../payment.service';
import { auth } from '../../../../../auth/auth';
import { ComboInterface } from '../../../interfaces/combo-interface';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { delay } from 'rxjs/internal/operators/delay';
import { BudgetDataComponent } from '../budget-data/budget-data.component';

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss']
})
export class BudgetFormComponent implements OnInit, OnDestroy {
  form: FormGroup;

  subLoad: Subscription;

  budget: any;
  departments: ComboInterface[] = [];

  loading = true;
  isSending = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private service: PaymentService,
    private budgetDataComponent: BudgetDataComponent
  ) { }

  ngOnInit() {
    this.loading = false;
    this.initForm();
    this.subLoad = this.route.data
    .pipe(
      switchMap(() => this.loadDepartments()),
      delay(500)
    ).subscribe(() => this.loading = false);

    this.loadDepartments();
    console.log(this.departments);
  }

  ngOnDestroy() {
    // this.churchDataComponent.closeSidenav();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      year: [null, Validators.required],
      value: [null, Validators.required],
      departmentId: [null, Validators.required]
    });
  }

  private loadDepartments() {
    return this.service
      .loadDepartments(auth.getCurrentUnit().id).pipe(
        tap((data: ComboInterface[]) => { this.departments = data; })
      );
  }

  public save(): void {
    const unit = auth.getCurrentUnit();
    const data = {
      id: !!this.budget ? this.budget.id : 0,
      unitId: unit.id,
      ...this.form.value
    };

    if (this.form.valid && this.check(data)) {
      this.isSending = true;
      console.log(data);
      this.service.saveBudget(data)
        .pipe(
          switchMap(() => this.budgetDataComponent.getData())
        ).subscribe(() => {
          this.isSending = false;
           this.budgetDataComponent.closeSidenav();
          this.snackBar.open('Salvo com sucesso!', 'OK', { duration: 5000 });
        }, err => {
          console.log(err);
          this.snackBar.open('Erro ao salvar orçamento, tente novamente.', 'OK', { duration: 5000 });
        });
    } else {
      this.snackBar.open('Já existe um orçamento cadastrado para o ano e para o departamento selecionado!', 'OK', { duration: 5000 });
    }
  }

  private check(data): boolean {
    const budgets = this.budgetDataComponent.budgetsCache.filter(f => f.year === data.year && f.departmentId === data.departmentId);
    return budgets.length === 0;
  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar Orçamento' : 'Novo Orçamento';
  }

  private checkIsEdit(): boolean {
    return this.budget !== undefined && this.budget !== null;
  }
}
