import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { BudgetDataInterface } from '../../../interfaces/budget-data-interface';
import { PaymentService } from '../../../payment.service';
import { auth } from '../../../../../auth/auth';
import { Filter } from '../../../../../core/components/filter/Filter.model';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';

@Component({
  selector: 'app-budget-data',
  templateUrl: './budget-data.component.html',
  styleUrls: ['./budget-data.component.scss']
})
export class BudgetDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = '/pagamentos/orcamentos';

  search$ = new Subject<string>();
  showList = 40;
  searchButton = false;

  yearsSelecteds: number[] = [];
  yearsData: Filter[] = [];

  // New
  budgets: BudgetDataInterface[] = [];
  budgetsCache: BudgetDataInterface[] = [];

  subLoad: Subscription;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private paymentService: PaymentService,
    private filterService: FilterService
  ) { super(router); }

  ngOnInit() {
    this.subLoad = this.getData()
    .pipe(
      switchMap(() => this.search$)
    ).subscribe(search => {
    });
  }
  ngOnDestroy(): void {
  }

  public getData() {
    this.search$.next('');
    this.loadYears();
    return this.paymentService.getBudgets(auth.getCurrentUnit().id, 2018)
    .pipe(
      tap(data => {
        this.budgetsCache = data;
        this.budgets = data.filter(f => f.Year === new Date().getFullYear());
      })
    );
    /**
     *       .getChurchAvaliationForm(id)
      .pipe(
        skipWhile(church => !church),
        tap(church => this.church = church)
      );
     */
  }

  private loadYears(): void {
    for (let i = 2014; i <= new Date().getFullYear(); i++) {
      this.yearsData.push(new Filter(i, i.toString()));
    }
    this.yearsSelecteds.push(new Date().getFullYear());
  }

  public search() {
    const budgetsFilttered = this.filterService.filter(this.budgetsCache, 'year', this.yearsSelecteds);
    this.budgets = budgetsFilttered;
  }

  public checkYear(year) {
    this.yearsSelecteds = this.filterService.check(year, this.yearsSelecteds);
    this.search();
  }

  public edit(): void {

  }
  public remove(): void {

  }

  public onScroll() {
    this.showList += 80;
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }
}
