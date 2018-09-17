import { auth } from './../../../../../auth/auth';
import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Districts } from '../../../models/districts';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TreasuryService } from '../../../treasury.service';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { utils } from '../../../../../shared/utils';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { AutoUnsubscribe } from '../../../../../shared/auto-unsubscribe-decorator';

@Component({
  selector: 'app-districts-data',
  templateUrl: './districts-data.component.html',
  styleUrls: ['./districts-data.component.scss']
})
@AutoUnsubscribe()
export class DistrictsDataComponent extends AbstractSidenavContainer implements OnInit {
  protected componentUrl = 'tesouraria/distritos';

  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();

  districtsCache: Districts[] = [];
  districts: Districts[] = [];

  sub1: Subscription;

  constructor(
    protected router: Router,
    private treasureService: TreasuryService,
    private snackBar: MatSnackBar,
    private confirmDialogService: ConfirmDialogService,
  ) { super(router); }

  ngOnInit() {
    this.sub1 = this.getData()
      .switchMap(() => this.search$)
      .subscribe(value => this.districts = this.searchFilter(value));
  }
  getData() {
    this.search$.next('');
    return this.treasureService.getDistricts(auth.getCurrentUnit().id).do(districts => {
      this.districtsCache = districts;
      this.districts = districts;
    });
  }
  /* Usados pelo component */
  onScroll() {
    this.showList += 15;
  }
  searchFilter(value: string): Districts[] {
    return this.districtsCache.filter(d =>
      utils.buildSearchRegex(value).test(d.name) ||
      utils.buildSearchRegex(value).test(d.analystName)
    );
  }
  remove(district: Districts) {
    this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover este distrito?', 'REMOVER')
      .skipWhile(res => res !== true)
      .switchMap(() => this.treasureService.removeDistricts(district.id))
      .switchMap(() => this.getData())
      .do(() => this.snackBar.open('Distrito removido com sucesso.', 'OK', { duration: 5000 }))
      .subscribe();
  }

  edit(district: Districts) {
    if (district.id === undefined) {
      return;
    }
    this.router.navigate(['tesouraria/distritos/' + district.id + '/editar']);
  }
}
