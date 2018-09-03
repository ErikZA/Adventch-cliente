import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { MatSidenav, MatSnackBar } from '@angular/material';

import { TreasuryService } from '../../../treasury.service';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { TreasurerStore } from '../treasurer.store';

import { Treasurer } from '../../../models/treasurer';
import { auth } from '../../../../../auth/auth';
import { Districts } from '../../../models/districts';
import { User } from '../../../../../shared/models/user.model';
import { utils } from '../../../../../shared/utils';

@Component({
  selector: 'app-treasurer-data',
  templateUrl: './treasurer-data.component.html',
  styleUrls: ['./treasurer-data.component.scss']
})
export class TreasurerDataComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();
  filterText = '';
  treasurers$: Observable<Treasurer[]>;

  subscribeUnit: Subscription;
  treasurers: Treasurer[] = [];
  treasurersCache: Treasurer[] = [];

  filterDistrict: number;
  filterAnalyst: number;
  filterFunction: number;
  districts: Districts[] = [];
  analysts: User[] = [];

  constructor(
    private router: Router,
    public treasureService: TreasuryService,
    public cd: ChangeDetectorRef,
    public confirmDialogService: ConfirmDialogService,
    public snackBar: MatSnackBar,
    private store: TreasurerStore,
  ) { }

  ngOnInit() {
    this.getData();
    this.search$.subscribe(search => {
      this.filterText = search;
      this.search();
    });
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
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
    this.treasureService.getTreasurers(auth.getCurrentUnit().id)
      .subscribe(data => {
      const wifhFunctionName = data.map(d => ({ ...d, functionName: this.getFunctionName(d) })) as Treasurer[];
      this.treasurersCache = wifhFunctionName;
      this.treasurers = wifhFunctionName;
      this.loadAnalysts();
      this.loadDistricts();
      this.search();
    });
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
      .subscribe(res => {
        if (res === true) {
          this.treasureService.deleteTreasurer(treasurer.id).subscribe(() => {
            this.snackBar.open('Tesoureiro removido!', 'OK', { duration: 5000 });
            this.getData();
          }, err => {
            console.log(err);
            this.snackBar.open('Erro ao remover tesoureiro, tente novamente.', 'OK', { duration: 5000 });
        });
        }
      });
  }

  removeAllTreasurers(treasurers) {
    this.confirmDialogService
      .confirm('Remover registro(s)', 'Você deseja realmente remover este(s) tesoureiro(s)?', 'REMOVER')
      .subscribe(res => {
        if (res === true) {
          // const status = false;
          const ids: number[] = this.treasurers.map(t => t.id);

          this.treasureService.deleteTreasurers(ids).subscribe(() => {
            this.getData();
            this.snackBar.open('Tesoureiro(s) removido(s)!', 'OK', { duration: 5000 });
          }, err => {
            console.log(err);
            this.snackBar.open('Erro ao salvar tesoureiro, tente novamente.', 'OK', { duration: 5000 });
          });
        }
      });
  }
  closeSidenav() {
    this.sidenavRight.close();
    this.router.navigate(['tesouraria/tesoureiros']);
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
    this.treasureService.getDistricts(auth.getCurrentUnit().id).subscribe((data: Districts[]) => {
      this.districts = data;
    });
  }
  private loadAnalysts() {
    this.treasureService.loadAnalysts(auth.getCurrentUnit().id).subscribe((data: User[]) => {
      this.analysts = data;
    });
  }
}
