import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { TreasuryService } from '../../treasury.service';
import { Treasurer } from '../../models/treasurer';
import { Unit } from '../../../../shared/models/unit.model';
import { Church } from '../../models/church';
import { MatSidenav } from '@angular/material';
import { EFunction } from '../../models/Enums';
import { AuthService } from '../../../../shared/auth.service';
import { forEach } from '@angular/router/src/utils/collection';
import * as moment from 'moment';
import { LayoutComponent } from '../../../../shared/layout/layout.component';
import { ConfirmDialogService } from './../../../../core/components/confirm-dialog/confirm-dialog.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-treasurer',
  templateUrl: './treasurer.component.html',
  styleUrls: ['./treasurer.component.scss']
})
export class TreasurerComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;
  @Input() currentUnit: any;

  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();
  treasurers$: Observable<Treasurer[]>;

  subscribe1: Subscription;
  treasurers: Treasurer[] = new Array<Treasurer>();
  treasurer: Treasurer = new Treasurer();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public treasureService: TreasuryService,
    public cd: ChangeDetectorRef,
    public confirmDialogService: ConfirmDialogService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    moment.locale('pt');
    this.getData();
    this.currentUnit = this.authService.getCurrentUnit();
    this.search$.subscribe(search => {
      this.searchTreasurers(search);
    });
    this.subscribe1 = this.authService.currentUnit.subscribe(() => {
      this.getData();
      this.closeSidenav();
    });
  }

  ngOnDestroy() {
    this.subscribe1.unsubscribe();
  }

  /*ngDoCheck() {
    if (this.authService.getCurrentUnit().id !== this.currentUnit.id) {
      this.cd.detectChanges();
      this.currentUnit = this.authService.getCurrentUnit();
      this.getData();
      this.closeSidenav();
    }
  }*/

  searchTreasurers(search) {
    if (search === '' || search === undefined || search === null) {
      this.treasurers$ = Observable.of(this.treasurers);
    } else {
      this.treasurers$ = Observable.of(this.treasurers.filter(data => {
        return data.name.toLowerCase().indexOf(search) !== -1
        || data.church.name.toLowerCase().indexOf(search) !== -1
        || data.functionName.toLowerCase().indexOf(search) !== -1;
      }));
    }
  }

  getData() {
    const unit = this.authService.getCurrentUnit();
    this.treasurers = [];
    this.treasureService.getTreasurers(unit.id).subscribe((data: Treasurer[]) => {
      this.treasurers = Object.assign(this.treasurers, data as Treasurer[]);
      this.treasurers.forEach(
        item => {
          item.functionName = (item.function === 1 ? 'Tesoureiro (a)' : item.function === 2 ? 'Associado (a)' : 'Assistente');
          if (item.dateRegister != null) {
            item.dateRegister = new Date(item.dateRegister);
            item.dateRegisterFormatted = moment(item.dateRegister).fromNow();
          }
        }
      );
      this.treasurers$ = Observable.of(this.treasurers);
    });
  }

  editTreasurer(treasurer): void {
    if (treasurer.id === undefined) {
      return;
    }
    this.treasurer = treasurer;
    this.router.navigate([treasurer.identity + '/editar'], { relativeTo: this.route });
    this.sidenavRight.open();
  }

  removeTreasurer(treasurer: Treasurer) {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este tesoureiro?', 'REMOVER')
      .subscribe(res => {
        if (res === true) {
          this.treasureService.deleteTreasurer(treasurer.id).subscribe(() => {
            this.getData();
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
    this.treasurer = new Treasurer();
    this.sidenavRight.open();
  }

  closeSidenav() {
    this.treasurer = new Treasurer();
    this.sidenavRight.close();
    this.router.navigate(['tesouraria/tesoureiros']);
  }

  onScroll() {
    this.showList += 15;
  }
}
