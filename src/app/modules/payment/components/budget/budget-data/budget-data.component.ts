import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { BudgetDataInterface } from '../../../interfaces/budget-data-interface';
import { PaymentService } from '../../../payment.service';
import { switchMap, tap } from 'rxjs/operators';

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

  // New
  budgets: BudgetDataInterface[] = [];

  subLoad: Subscription;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private paymentService: PaymentService
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
    return this.paymentService.getBudgets(1)
    .pipe(
      tap(data => this.budgets = data)
    );
    /**
     *       .getChurchAvaliationForm(id)
      .pipe(
        skipWhile(church => !church),
        tap(church => this.church = church)
      );
     */
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
