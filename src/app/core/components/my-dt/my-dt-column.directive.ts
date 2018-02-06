import { Directive, Input, Output, HostBinding, HostListener, EventEmitter, ElementRef } from '@angular/core';

@Directive({ selector: '[my-dt-column]' })
export class MyDTColumn {
	@Output() onSort: EventEmitter<any> = new EventEmitter();

	@HostBinding('class.sorted-asc') sortedAsc;
	@HostBinding('class.sorted-desc') sortedDesc;
	_sortOrder: string;
	public sort(order?: string) {
		this._sortOrder = order !== undefined ? order : (!this._sortOrder || this._sortOrder == 'desc') ? 'asc' : 'desc'
		this.sortedAsc = this.sortOrder === 'asc';
		this.sortedDesc = this.sortOrder === 'desc';
	}
	get sortOrder(): string {
		return this._sortOrder;
	}
	get isSorted(): boolean {
		return this._sortOrder !== undefined && this._sortOrder !== null && this._sortOrder !== '';
	}
	column: string;
	@Input('my-dt-column')
	set setItem(column: any) {
		this.column = column;
	}

	@HostListener('click') onClick() {
		this.sort();
		this.onSort.emit({ orderBy: this.column, sortOrder: this._sortOrder });
	}

	constructor(private el: ElementRef) { }
}
