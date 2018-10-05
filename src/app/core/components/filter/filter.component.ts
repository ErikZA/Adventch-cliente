import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';

import { FilterService } from '../filter/service/filter.service';
import { Filter } from '../filter/Filter.model';
import {  } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit {

  @Input()
  data: Filter[];

  @Input()
  placeholder: string;

  @Input()
  emptyMessage: string;

  @Input()
  defaultValues: any = [];

  @Output()
  filterEmitted: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private service: FilterService
  ) { }

  ngOnInit() {
  }

  public clickFilter(id): void {
    this.filterEmitted.emit(id);
  }
}
