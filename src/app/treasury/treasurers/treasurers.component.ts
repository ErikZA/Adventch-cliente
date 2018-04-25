import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { State } from '../../core/components/progress-spinner/models/state';
import { Table } from '../../core/components/data-table/models/table';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SidenavService } from '../../core/services/sidenav.service';
import { Subscription } from 'rxjs';
import { TreasuryService } from '../treasury.service';
import { Treasurer } from '../models/treasurer';
import { Unit } from '../../shared/models/unit.model';
import { Church } from '../models/church';
import { MatSidenav, MatTableDataSource, MatPaginator } from '@angular/material';
import { TreasurersFormComponent } from './components/treasurers-form/treasurers-form.component';
import { EFunction } from '../models/Enums';
import { AuthService } from '../../shared/auth.service';
import { SelectionModel } from '@angular/cdk/collections';
import { forEach } from '@angular/router/src/utils/collection';
import * as moment from 'moment';
import { LayoutComponent } from '../../shared/layout/layout.component';

@Component({
  selector: 'app-treasurer',
  templateUrl: './treasurers.component.html',
  styleUrls: ['./treasurers.component.scss']
})
export class TreasurersComponent implements OnInit {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() currentUnit: any;

  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<Element>(true, []);
  displayedColumns = ["select", "name", "church", "function", "registrationDate", "phone", "email"];

  subscribe1: Subscription;
  treasurers: Treasurer[] = new Array<Treasurer>();
  treasurer: Treasurer = new Treasurer();
  form: FormGroup;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sidenavService: SidenavService,
    public TrasureService: TreasuryService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    moment.locale("pt");
    this.getData();
    this.currentUnit = this.authService.getCurrentUnit();
  }
  
  ngDoCheck() {
    if (this.authService.getCurrentUnit().id !== this.currentUnit.id) {
      this.cd.detectChanges();
      this.currentUnit = this.authService.getCurrentUnit();
      this.getData();
    }
  }

  getData(){
    var unit = this.authService.getCurrentUnit();
    this.treasurers = [];
    this.TrasureService.getTreasurers(unit.id).subscribe((data: Treasurer[]) =>{
      this.treasurers = Object.assign(this.treasurers, data as Treasurer[]);
      this.treasurers.forEach(
        item => { 
          item.functionName = (item.function == 1 ? "Tesoureiro (a)" : item.function == 2 ? "Associado (a)" : "Assistente");
          if(item.dateRegister != null)
            item.dateRegisterFormatted = moment(item.dateRegister).fromNow();           
        }        
      );
      this.dataSource = new MatTableDataSource<any>(this.treasurers);
    })
  }

  editTreasurer(treasurer): void{
    if(treasurer.id == undefined)
      return;
    this.treasurer = treasurer;
    this.router.navigate([treasurer.id + '/edit'], { relativeTo: this.route });
    this.sidenavRight.open();
  }

  removeTreasurers(treasurers) {
    console.log(treasurers);
  }


  openSidenav() {
    this.treasurer = new Treasurer();
    this.sidenavRight.open();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.configurePaginator();
    if(this.dataSource != undefined)
      this.dataSource.paginator = this.paginator;
  }

  configurePaginator() {
    this.paginator._intl.firstPageLabel = "Primeira página";
    this.paginator._intl.lastPageLabel = "Ultima página";
    this.paginator._intl.nextPageLabel = "Próxima página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.itemsPerPageLabel = "Itens por página:";
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    console.log(this.selection);
  }
}
