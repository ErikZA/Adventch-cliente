import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { MatSidenav, MatSnackBar } from '@angular/material';

import { AuthService } from '../../../../../shared/auth.service';
import { TreasuryService } from '../../../treasury.service';
import { ConfirmDialogService } from './../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { TreasurerStore } from '../treasurer.store';

import { Treasurer } from '../../../models/treasurer';
import { Districts } from '../../../models/districts';
import { User } from '../../../../../shared/models/user.model';

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
  filterText: string = '';
  treasurers$: Observable<Treasurer[]>;

  subscribeUnit: Subscription;
  treasurers: Treasurer[] = new Array<Treasurer>();

  filterDistrict: number;
  filterAnalyst: number;
  districts: Districts[] = new Array<Districts>();
  analysts: User[] = new Array<User>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public treasureService: TreasuryService,
    public cd: ChangeDetectorRef,
    public confirmDialogService: ConfirmDialogService,
    public snackBar: MatSnackBar,
    private store: TreasurerStore,
    private sidenavService: SidenavService,
  ) { }

  ngOnInit() {
    this.getData();
    this.search$.subscribe(search => {
      this.filterText = search;
      this.search();
    });
    this.subscribeUnit = this.authService.currentUnit.subscribe(() => {
      this.getData();
      this.closeSidenav();
    });
    this.sidenavService.setSidenav(this.sidenavRight);
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  getData() {
    this.treasurers$ = this.store.treasurers$;
    this.store.loadAll();    
    this.loadAnalysts();
    this.loadDistricts();
  }

  editTreasurer(treasurer): void {
    if (treasurer.id === undefined) {
      return;
    }
    this.store.editTreasurer(treasurer);
    this.router.navigate(['tesouraria/tesoureiros/editar']);
    this.sidenavRight.open();
  }

  removeTreasurer(treasurer: Treasurer) {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este tesoureiro?', 'REMOVER')
      .subscribe(res => {
        if (res === true) {
          this.treasureService.deleteTreasurer(treasurer.id).subscribe(() => {
            this.store.removeTreasurer(treasurer);
            this.snackBar.open('Tesoureiro removido!', 'OK', { duration: 5000 });
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
          const status = false;
          const ids = [];
          for (const treasurer of treasurers) {
            ids.push(treasurer.id);
          }

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

  removeTreasurers(treasurers: Treasurer[]): boolean {
    if (!treasurers) {
      return false;
    }
    let status = false;
    for (const treasurer of treasurers) {
      this.treasureService.deleteTreasurer(treasurer.id).subscribe(success => status = true, err => {
        console.log(err);
        status = false;
      });
    }
    this.getData();
    return status;
  }

  openSidenav() {
    this.treasureService.setTreasurer(new Treasurer());
    this.sidenavService.open();
  }

  closeSidenav() {
    this.treasureService.setTreasurer(new Treasurer());
    this.sidenavService.close();
    this.router.navigate(['tesouraria/tesoureiros']);
  }

  onScroll() {
    this.showList += 15;
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public search() {
    let treasurersFilttered = this.store.searchTreasurers(this.filterText);

    if (this.filterDistrict != undefined && this.filterDistrict != null && this.filterDistrict != 0) {
      treasurersFilttered = this.store.searchDistricts(this.filterAnalyst, treasurersFilttered);
    }
    if (this.filterAnalyst != undefined && this.filterAnalyst != null && this.filterAnalyst != 0) {
      treasurersFilttered = this.store.searchAnalyst(this.filterAnalyst, treasurersFilttered);
    }
    this.treasurers$ = Observable.of(treasurersFilttered);    
  }

  private loadDistricts() {
    this.treasureService.getDistricts(this.authService.getCurrentUnit().id).subscribe((data: Districts[]) => {
      this.districts = data;
    });
  }

  private loadAnalysts() {
    this.treasureService.loadAnalysts(this.authService.getCurrentUnit().id).subscribe((data: User[]) => {
      this.analysts = data;
    });
  }
}
