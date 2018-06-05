import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Table } from './models/table';
import { Column, Size } from './models/column';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { State } from '../progress-spinner/models/state';
import { SidenavService } from '../../services/sidenav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() table: Table;
  @Input() state: State;
  @Output() clickRow = new EventEmitter();
  @Output() createEvent = new EventEmitter();
  @Output() removeEvent = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  headersColumns: Array<string>;
  selection = new SelectionModel<Element>(true, []);

  constructor(
    private navService: SidenavService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('ngOnInit dataTable');
    if (this.table != null || this.table !== undefined) {
      this.dataSource = new MatTableDataSource<any>(this.table.data);
      this.headersColumns = this.table.columns.map(obj => obj.header);
    }
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

  refreshData() {
    this.dataSource = new MatTableDataSource<any>(this.table.data);
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
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.lastPageLabel = 'Ultima página';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.itemsPerPageLabel = 'Itens por página:';
  }

  addButton() {
    this.createEvent.emit();
  }

  selectVisible(value) {
    if (value && this.headersColumns[0] !== 'select') {
      this.headersColumns.unshift('select');
    }
    return true;
  }

  removeAllSelected() {
    this.removeEvent.emit(this.selection.selected);
  }

  rowItem(row) {
    this.clickRow.emit(row);
  }

  setSizeColumn(column: Column) {
    switch (column.size) {
      case Size.ExtraSmall:
        return {
          'flex': 'calc(1/2)'
        };
      case Size.Small:
        return {
          'flex': '1'
        };
      case Size.Medium:
        return {
          'flex': '3'
        };
      case Size.Large:
        return {
          'flex': '4'
        };
      case Size.ExtraLarge:
        return {
          'flex': '5'
        };
    }
    if (column.size != null || column.size !== undefined) {
      return {
        'flex': '0 0 ' + column.size
      };
    }
    return {
      'flex': '1'
    };
  }
}

