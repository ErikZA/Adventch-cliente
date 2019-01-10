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
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-budget-data',
  templateUrl: './budget-data.component.html',
  styleUrls: ['./budget-data.component.scss']
})
export class BudgetDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = '/pagamentos/orcamentos';

  search$ = new Subject<string>();
  showList = 20;
  searchButton = false;

  filterText = '';
  years: Number[] = [];
  yearFilter: number;
  responsiblesData: Filter[] = [];
  responsibleFilter: Filter;
  departmentsData: Filter[] = [];
  departmentFilter: Filter;

  // New
  budgets: BudgetDataInterface[] = [];
  budgetsCache: BudgetDataInterface[] = [];

  subLoad: Subscription;
  subFilter: Subscription;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private paymentService: PaymentService,
    private filterService: FilterService
  ) { super(router); }

  ngOnInit() {
    this.yearFilter = new Date().getFullYear();
    this.loadYears();
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
    console.log(this.yearFilter);
    this.search$.next('');
    return this.paymentService.getBudgets(auth.getCurrentUnit().id, this.yearFilter)
    .pipe(
      tap(data => {
        this.budgetsCache = data;
        const budgetsAux = data;
        for (let i = 0; i < this.showList; i++) {
          this.budgets.push(data[i]);
        }
        this.loadResponsibles(data);
        this.loadParents(data);
        this.search();
      })
    );
  }

  private loadYears(): void {
    for (let i = 2014; i <= this.yearFilter; i++) {
      this.years.push(i);
    }
  }

  private loadResponsibles(data): void {
    this.responsiblesData = [];
    const responsibleAux = [];
    if (!Array.isArray(data)) {
      return;
    }
    data.forEach(budget => {
      const responsibles = budget.departmentResponsibles;
      if (responsibles != null && responsibles !== undefined) {
      responsibles.split(',').forEach(responsible => {
        if (responsibleAux.map(m => m.name).indexOf(responsible) === -1) {
          if (responsible !== '') {
            responsibleAux.push(new Filter(responsibleAux.length, responsible));
          }
        }
      });
    }
    });
    this.responsiblesData = responsibleAux.sort((a, b) => a.name.localeCompare(b.name));
  }

  private loadParents(data): void {
    this.departmentsData = [];
    const departmentAux = [];
    if (!Array.isArray(data)) {
      return;
    }
    data.forEach(budget => {
      if (budget.parent != null) {
        if (departmentAux.map(m => m.name).indexOf(budget.parent) === -1) {
          departmentAux.push(new Filter(departmentAux.length, budget.parent));
        }
      }
    });
    this.departmentsData = departmentAux.sort((a, b) => a.name.localeCompare(b.name));
  }

  public searchYear(year): void {
    this.yearFilter = year;
    this.budgets = [];
    this.subFilter = this.getData().subscribe();
  }

  public searchResponsible(responsible): void {
    this.responsibleFilter = responsible;
    this.search();
  }

  public searchParent(department): void {
    this.departmentFilter = department;
    this.search();
  }

  private search() {
    this.budgets = [];
    let budgetsFilttered = this.budgetsCache.filter(c => utils.buildSearchRegex(this.filterText).test(c.departmentName.toUpperCase()));
    if (this.responsibleFilter !== undefined) {
      budgetsFilttered = budgetsFilttered.filter(f => f.departmentResponsibles.indexOf(this.responsibleFilter.name) !== -1);
    }
    if (this.departmentFilter !== undefined) {
      budgetsFilttered = budgetsFilttered.filter(f => f.parent === this.departmentFilter.name);
    }
    this.onDemand(budgetsFilttered);
  }

  public edit(budget): void {
    this.router.navigate([budget.id, 'editar'], { relativeTo: this.route });
    this.openSidenav();

  }
  public remove(): void {

  }

  public onScroll() {
    this.showList += 20;
    this.search();
    // this.onDemand(this.budgetsCache);
  }

  private onDemand(budgetsFilttered) {
    const currentDemand = this.showList - 20;
    const solicitedDemand = this.showList;
    for (let i = 0; i < solicitedDemand; i++) {
      if (budgetsFilttered[i] != null) {
      this.budgets.push(budgetsFilttered[i]);
      }
    }
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }
}
