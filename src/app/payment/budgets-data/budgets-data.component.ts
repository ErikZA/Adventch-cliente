import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';

import * as _ from 'lodash';
import { Subscription } from 'rxjs/Rx';

import { BudgetsComponent } from './../budgets/budgets.component';
import { ConfirmDialogService } from './../../core/components/confirm-dialog/confirm-dialog.service';

import { BudgetService } from './../payment.service';
import { Budgets } from './../models/budgets';

@Component({
  selector: 'app-budgets-data',
  templateUrl: './budgets-data.component.html',
  styleUrls: ['./budgets-data.component.scss']
})
export class BudgetsDataComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInputEl: ElementRef;

  form: FormGroup;
  isLoading: boolean = true;
  isMobile: boolean;
  budgets: Budgets = new Budgets();
  subscribe1: Subscription;
  subscribe2: Subscription;
  subscribe3: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private budgetService: BudgetService,
    private confirmDialogService: ConfirmDialogService,
    private media: ObservableMedia,
    private router: Router,
    public budgetsComponent: BudgetsComponent,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl('0', Validators.required),
      name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      description: new FormControl(null, Validators.maxLength(200))
    });

    this.subscribe1 = this.media.subscribe((change: MediaChange) => setTimeout(() => this.isMobile = change.mqAlias === 'xs'));
    this.subscribe2 = this.activatedRoute.params.subscribe((params: any) => {
      let id = params['id'];
      if (!id)
        return;
      this.subscribe3 = this.budgetService.getBudgets(id).subscribe((data: Budgets[]) => {
        if (data) {
          this.budgets = Object.assign(new Budgets(), data[0]);
          this.form.markAsDirty();
        }
      });
    });
    //this.budgetsComponent.sidenavRight.open();
    this.isLoading = false;
  }

  ngOnDestroy() {
    if (this.subscribe1) this.subscribe1.unsubscribe();
    if (this.subscribe2) this.subscribe2.unsubscribe();
    if (this.subscribe3) this.subscribe3.unsubscribe();
  }

  close() {
    // if (this.budgetsComponent && this.budgetsComponent.sidenavRight.opened)
    //   this.budgetsComponent.sidenavRight.close();

    if (this.router.url.indexOf('/budgets/') !== -1)
      this.router.navigate([this.router.url.split(/\/budgets\//gi)[0] + '/budgets']);
  }

  save() {
    if (this.form.invalid)
      return;
    this.isLoading = true;
    this.budgets.name = this.form.value.name;
    this.budgets.description = this.form.value.description;

    // this.budgetService.saveBonificationType(this.budgets.id, this.budgets.name, this.budgets.description)
    //   .then((data) => {
    //     if (data && this.budgetsComponent.dataFiltered) {
    //       var item = this.budgetsComponent.data.find(obj => obj.id === this.budgets.id);
    //       if (item)
    //         this.budgetsComponent.data = this.budgetsComponent.data.filter(obj => obj.id !== this.budgets.id);
    //       else
    //         this.budgets.id = data.id;
    //       this.budgetsComponent.data.push(this.budgets);
    //       this.budgetsComponent.data = this.budgetsComponent.data.sort((a, b) => a.name.localeCompare(b.name));
    //       this.budgetsComponent.search();
    //     }
    //     this.snackBar.open('Orçamento salvo!', 'OK', { duration: 3000 });
    //     this.isLoading = false;
    //     this.close();
    //   }, err => console.log(err))
  }

}
