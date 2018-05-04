import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription, Subject } from 'rxjs';
import { TreasuryService } from '../treasury.service';
import { Treasurer } from '../models/treasurer';
import { Unit } from '../../shared/models/unit.model';
import { Church } from '../models/church';
import { MatSidenav } from '@angular/material';
import { EFunction } from '../models/Enums';
import { AuthService } from '../../shared/auth.service';
import { forEach } from '@angular/router/src/utils/collection';
import * as moment from 'moment';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { ConfirmDialogService } from './../../core/components/confirm-dialog/confirm-dialog.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-treasurer',
  templateUrl: './treasurers.component.html',
  styleUrls: ['./treasurers.component.scss']
})
export class TreasurersComponent implements OnInit {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;
  @Input() currentUnit: any;

  searchButton: boolean = false;
  showList: number = 15;
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
    moment.locale("pt");
    this.getData();
    this.currentUnit = this.authService.getCurrentUnit();
    this.search$.subscribe(search => {
      this.searchTreasurers(search);
    });
  }

  ngDoCheck() {
    if (this.authService.getCurrentUnit().id !== this.currentUnit.id) {
      this.cd.detectChanges();
      this.currentUnit = this.authService.getCurrentUnit();
      this.getData();
      this.closeSidenav();
    }
  }

  searchTreasurers(search) {
    if (search === '' || search === undefined || search === null) {
      this.treasurers$ = Observable.of(this.treasurers);
    } else {
      this.treasurers$ = Observable.of(this.treasurers.filter(data => {
        return data.name.toLowerCase().indexOf(search) !== -1 || data.church.name.toLowerCase().indexOf(search) !== -1 || data.functionName.toLowerCase().indexOf(search) !== -1;
      }));
    }
  }

  getData(){
    var unit = this.authService.getCurrentUnit();
    this.treasurers = [];
    this.treasureService.getTreasurers(unit.id).subscribe((data: Treasurer[]) =>{
      this.treasurers = Object.assign(this.treasurers, data as Treasurer[]);
      this.treasurers.forEach(
        item => {
          item.functionName = (item.function == 1 ? "Tesoureiro (a)" : item.function == 2 ? "Associado (a)" : "Assistente");
          if(item.dateRegister != null)
            item.dateRegisterFormatted = moment(item.dateRegister).fromNow();
        }
      );
      this.treasurers$ = Observable.of(this.treasurers);
    })
  }

  editTreasurer(treasurer): void{
    if(treasurer.id == undefined)
      return;
    this.treasurer = treasurer;
    this.router.navigate([treasurer.identity + '/editar'], { relativeTo: this.route });
    this.sidenavRight.open();
  }

  remove(treasurers) {
    let response;
    this.confirmDialogService
      .confirm("Remover registro(s)", "Você deseja realmente remover este(s) tesoureiro(s)?", "REMOVER")
      .subscribe(res => {
        if (res == true) {
          let status = false;
          let ids = [];
          for (const treasurer of treasurers)
            ids.push(treasurer.id);

          this.treasureService.deleteTreasurers(ids).subscribe(() =>{
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
      this.treasureService.deleteTreasurer(treasurer.id).subscribe(success => status = true, err =>{
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
