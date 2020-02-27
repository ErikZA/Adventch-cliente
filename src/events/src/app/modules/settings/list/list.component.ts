import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ListFormComponent } from './list-form/list-form.component';
import { ListService } from './list.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public list$: Observable<any>;
  public lists: List[] = [];

  constructor(
    public dialog: MatDialog,
    private list: ListService,
    private store: Store<any>,
  ) {
    this.list$ = store.select('list');
  }

  ngOnInit() {
    this.list.All();
    this.list$.subscribe(res => this.lists = res)
  }

  OpenListForm() {
    this.dialog.open(ListFormComponent, {
      width: '300'
    })
  }

  UpdateOpenListForm(id: string) {
    this.dialog.open(ListFormComponent, {
      width: '300',
      data: { id }
    })
  }

  Remove(id: string) {
    this.list.Remove(id)
  }

}
