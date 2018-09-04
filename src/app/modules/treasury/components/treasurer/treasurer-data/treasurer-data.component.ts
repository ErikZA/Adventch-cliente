import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import {MatSnackBar } from '@angular/material';

import { TreasuryService } from '../../../treasury.service';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';

import { Treasurer } from '../../../models/treasurer';
import { auth } from '../../../../../auth/auth';
import { Districts } from '../../../models/districts';
import { User } from '../../../../../shared/models/user.model';
import { utils } from '../../../../../shared/utils';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import 'rxjs/add/observable/of';
import { Subscription } from 'rxjs/Subscription';
import { AutoUnsubscribe } from '../../../../../shared/auto-unsubscribe-decorator';

@Component({
  selector: 'app-treasurer-data',
  templateUrl: './treasurer-data.component.html',
  styleUrls: ['./treasurer-data.component.scss']
})
@AutoUnsubscribe()
export class TreasurerDataComponent extends AbstractSidenavContainer implements OnInit {
  protected componentUrl = 'tesouraria/tesoureiros';
  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();
  filterText = '';

  treasurers: Treasurer[] = [];
  treasurersCache: Treasurer[] = [];

  filterDistrict: number;
  filterAnalyst: number;
  filterFunction: number;
  districts: Districts[] = [];
  analysts: User[] = [];


  sub1: Subscription;

  constructor(
    protected router: Router,
    private treasureService: TreasuryService,
    private confirmDialogService: ConfirmDialogService,
    private snackBar: MatSnackBar,
  ) { super(router); }

  ngOnInit() {
   this.sub1 = this.getData().switchMap(() => this.search$).subscribe(search => {
      this.filterText = search;
      this.search();
    });
  }
  getFunctionName(treasurer: Treasurer) {
    if (treasurer.function === 1) {
      return 'Tesoureiro (a)';
    }
    if (treasurer.function === 2) {
      return 'Tesoureiro (a) Associado (a)';
    }
    return 'Tesoureiro (a) Assistente';
  }
  getData() {
    return this.treasureService
      .getTreasurers(auth.getCurrentUnit().id)
      .map(data => data.map(d => ({ ...d, functionName: this.getFunctionName(d) })) as Treasurer[])
      .do(data => {
        this.treasurersCache = data;
        this.treasurers = data;
        this.search();
      })
      .switchMap(() => this.loadAnalysts())
      .switchMap(() => this.loadDistricts());
  }

  editTreasurer(treasurer): void {
    const id = treasurer.id;
    if (id === undefined) {
      return;
    }
    this.router.navigate([`tesouraria/tesoureiros/${id}/editar`]);
  }

  removeTreasurer(treasurer: Treasurer) {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este tesoureiro?', 'REMOVER')
      .skipWhile(res => res !== true)
      .switchMap(() => this.treasureService.deleteTreasurer(treasurer.id))
      .switchMap(() => this.getData())
      .do(() => this.snackBar.open('Tesoureiro removido!', 'OK', { duration: 5000 }))
      .subscribe(null, err => {
        console.log(err);
        this.snackBar.open('Erro ao remover tesoureiro, tente novamente.', 'OK', { duration: 5000 });
      });
  }

  onScroll() {
    this.showList += 15;
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public searchAnalyst(idAnalyst: number, treasurers: Treasurer[]): Treasurer[] {
    // tslint:disable-next-line:triple-equals
    return treasurers.filter(x => x.church.district.analyst.id == idAnalyst);
  }

  public searchDistricts(idDistrict: number, treasurers: Treasurer[]): Treasurer[] {
    // tslint:disable-next-line:triple-equals
    return treasurers.filter(x => x.church.district.id == idDistrict);
  }

  public searchFunction(idFunction: number, treasurers: Treasurer[]): Treasurer[] {
    // tslint:disable-next-line:triple-equals
    return treasurers.filter(x => x.function == idFunction);
  }
  public search() {
    let treasurersFilttered = this.treasurersCache.filter(t => utils.buildSearchRegex(this.filterText).test(t.name));
    // tslint:disable-next-line:triple-equals
    if (this.filterDistrict !== undefined && this.filterDistrict != null && this.filterDistrict != 0) {
      treasurersFilttered = this.searchDistricts(this.filterDistrict, treasurersFilttered);
    }
    // tslint:disable-next-line:triple-equals
    if (this.filterAnalyst !== undefined && this.filterAnalyst != null && this.filterAnalyst != 0) {
      treasurersFilttered = this.searchAnalyst(this.filterAnalyst, treasurersFilttered);
    }
    // tslint:disable-next-line:triple-equals
    if (this.filterFunction !== undefined && this.filterFunction != null && this.filterFunction != 0) {
      treasurersFilttered = this.searchFunction(this.filterFunction, treasurersFilttered);
    }
    this.treasurers = treasurersFilttered;
  }
  private loadDistricts() {
    return this.treasureService.getDistricts(auth.getCurrentUnit().id).do((data: Districts[]) => {
      this.districts = data;
    });
  }
  private loadAnalysts() {
    return this.treasureService.loadAnalysts(auth.getCurrentUnit().id).do((data: User[]) => {
      this.analysts = data;
    });
  }
}
