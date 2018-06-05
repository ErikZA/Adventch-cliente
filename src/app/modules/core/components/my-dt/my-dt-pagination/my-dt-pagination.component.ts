import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'my-dt-pagination',
  templateUrl: './my-dt-pagination.component.html',
  styleUrls: ['./my-dt-pagination.component.scss']
})
export class MyDtPaginationComponent implements OnInit {
	@Output() onPageChanged: EventEmitter<any> = new EventEmitter();
  @Input('current-page') public currentPage: number = 1;
  @Input('page-size') public pageSize: number = 20;
	@Input('total-rows') public totalRows: number = 0;

  constructor(){}

  ngOnInit() {
  }

  prevPage() {
    if (this.currentPage > 1)
      this.currentPage--;
		this.onPageChanged.emit({currentPage:this.currentPage, pageSize:this.pageSize, totalRows:this.totalRows});
  }

  nextPage() {
    var v = this.totalRows / this.pageSize;
    if (this.currentPage < v)
      this.currentPage++;
		this.onPageChanged.emit({currentPage:this.currentPage, pageSize:this.pageSize, totalRows:this.totalRows});
  }

  setPageSize(value) {
    if (this.pageSize == value)
      return;
    this.currentPage = 1;
    this.pageSize = value;
		this.onPageChanged.emit({currentPage:this.currentPage, pageSize:this.pageSize, totalRows:this.totalRows});
  }

  getStartRow(){
    return this.currentPage * this.pageSize - this.pageSize + 1;
  }

  getEndRow(){
    return this.currentPage * this.pageSize;
  }

}
