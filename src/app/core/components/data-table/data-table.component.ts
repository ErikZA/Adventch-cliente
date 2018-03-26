import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Table } from './models/table';
import { Column } from './models/column';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { State } from '../progress-spinner/models/state';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() table: Table;
  @Input() state: State;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  headersColumns: any;

  paginationDetail;
  constructor() {}

  ngOnInit() {
    if(this.table != null || this.table != undefined){
      this.dataSource = new MatTableDataSource<any>(this.table.data);
      this.headersColumns = this.table.columns.map(obj => obj.header);
    }
  }

  ngAfterViewInit() {
    this.configurePaginator();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  configurePaginator() {
    this.paginator._intl.firstPageLabel = "Primeira página";
    this.paginator._intl.lastPageLabel = "Ultima página";
    this.paginator._intl.nextPageLabel = "Próxima página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.itemsPerPageLabel = "Itens por página:";
  }
}

