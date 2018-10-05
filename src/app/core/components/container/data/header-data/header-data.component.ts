import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../../../shared/auto-unsubscribe-decorator';

@Component({
  selector: 'app-header-data',
  templateUrl: './header-data.component.html',
  styleUrls: ['./header-data.component.scss']
})
@AutoUnsubscribe()
export class HeaderDataComponent implements OnInit {

  @Input()
  public name: string;
  @Input()
  public search = true;
  @Input()
  public filter = false;
  @Input()
  public report = false;

  private subSearch: Subscription;

  public search$: Subject<string> = new Subject<string>();

  @Output()
  private searchEmitted: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  private filterEmitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  private reportEmmited: EventEmitter<boolean> = new EventEmitter<boolean>();

  public searchButton = false;

  public searchWord = '';

  constructor() { }

  ngOnInit() {
    this.subSearch = this.search$
    .subscribe(search => {
      this.searchTheList(search);
    });
  }

  private searchTheList(search: string): void {
    this.searchEmitted.emit(search);
  }

  private filterTheList(): void {
    this.filterEmitted.emit();
  }

  private generateReport(): void {
    this.reportEmmited.emit();
  }

  public getSearch(): string {
    return this.searchWord;
  }

  public cleanSearch(): void {
    this.searchWord = '';
  }
}
