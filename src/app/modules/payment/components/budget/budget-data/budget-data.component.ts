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
import { utils } from '../../../../../shared/utils';

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

  filterText = '';
  yearsSelecteds: number[] = [];
  yearsData: Filter[] = [];
  responsiblesSelecteds: number[] = [];
  responsiblesData: Filter[] = [];

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
      this.filterText = search;
      this.search();
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
        this.budgets = data.filter(f => f.year === new Date().getFullYear());
        this.loadResponsibles(data);
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
    this.checkYear(new Date().getFullYear());
  }

  private loadResponsibles(data): void {
    this.responsiblesData = [];
    if (!Array.isArray(data)) {
      return;
    }
    data.forEach(budget => {
      const responsibles = budget.departmentResponsibles;
      if (responsibles != null && responsibles !== undefined) {
      responsibles.split(',').forEach(responsible => {
        if (this.responsiblesData.map(m => m.name).indexOf(responsible) === -1) {
          this.responsiblesData.push(new Filter(this.responsiblesData.length, responsible));
        }
      });
    }
    });
  }

  public search() {
    let budgetsFilttered = this.budgetsCache.filter(c => utils.buildSearchRegex(this.filterText).test(c.departmentName.toUpperCase()));
    budgetsFilttered = this.filterService.filter(budgetsFilttered, 'year', this.yearsSelecteds);

    const responsibles = this.getResponsibles();
    if (responsibles !== '') {
      budgetsFilttered = budgetsFilttered.filter(f => responsibles.indexOf(f.departmentResponsibles) !== -1);
    }
    this.budgets = budgetsFilttered;
  }

  private getResponsibles(): string {
    let responsibles = '';
    responsibles = this.responsiblesData.filter(f => this.responsiblesSelecteds.indexOf(f.id) !== -1).map(m => m.name).toString();
    return responsibles;
  }

  public checkYear(year) {
    this.yearsSelecteds = this.filterService.check(year, this.yearsSelecteds);
    this.search();
  }

  public checkResponsible(responsible) {
    this.responsiblesSelecteds = this.filterService.check(responsible, this.responsiblesSelecteds);
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
