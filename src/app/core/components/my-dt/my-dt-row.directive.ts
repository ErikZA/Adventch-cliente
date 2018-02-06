import { Directive, Input, Output, DoCheck, HostListener, HostBinding, EventEmitter } from '@angular/core';

@Directive({ selector: '[my-dt-row]' })
export class MyDTRow implements DoCheck {
	item: any;
	@Output() onChange: EventEmitter<any> = new EventEmitter();
	@Input('my-dt-row')
	set setItem(item: any) {
		this.item = item;
	}

	constructor() { }

	ngDoCheck() {
		if (this.classSelected != this.item.checked) {
			this.classSelected = this.item.checked;
			this.onChange.emit(this.item);
		}
	}

	@HostBinding('class.selected') classSelected: boolean;

	@HostListener('click') onClick() {
		this.item.checked = !this.item.checked;
		this.classSelected = this.item.checked;
		this.onChange.emit(this.item);
	}
}
