import { OnInit, AfterContentInit, Component, Input, Renderer2, ElementRef, ContentChildren, EventEmitter, Output, QueryList } from '@angular/core';
import { MyDTColumn } from "./my-dt-column.directive";

@Component({
	selector: '[my-dt]',
	template: '<ng-content></ng-content>',
	styleUrls: ['./my-dt.component.scss']
})
export class MyDT implements OnInit, AfterContentInit {
	@ContentChildren(MyDTColumn) columns: QueryList<MyDTColumn>;
	@Output('sort') onSort: EventEmitter<any> = new EventEmitter();

	constructor(
		private el: ElementRef,
		private renderer: Renderer2
	){}

	ngOnInit() {
		//this.renderer.addClass(this.el.nativeElement, 'my-dt-class');
		//this.el.nativeElement.style.backgroundColor = 'yellow';
	}

	ngAfterContentInit() {
		var lst = this.columns.toArray();
		lst.forEach(c => {
			c.onSort.subscribe(data => {
				lst.forEach(c2 => {
					if (c2.column != c.column)
						c2.sort(null);
				});
				this.onSort.emit(data);
			});
		});
	}
}
