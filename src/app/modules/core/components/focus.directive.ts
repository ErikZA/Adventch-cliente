import { Directive, Input, OnChanges, ElementRef, Renderer } from '@angular/core';

@Directive({ selector: '[focus]' })
export class FocusDirective implements OnChanges {
	@Input('focus') focus: boolean;
	constructor(
		private el: ElementRef,
		private renderer: Renderer
	) { }

	ngOnChanges() {
		if (this.focus)
			this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
	}
}
