import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[InputMask]'
})
export class InputMaskDirective implements ControlValueAccessor {

  onTouched: any;
  onChange: any;

  @Input('InputMask') textMask: string;

  constructor(private el: ElementRef) {}

  writeValue(value: any): void {
    if (value) {
      this.el.nativeElement.value = this.aplicarMascara(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('keyup', ['$event'])
  onKeyup($event: any) {
    let valor = $event.target.value.replace(/\D/g, '');
    console.log(this);

    // retorna caso pressionado backspace
    if ($event.keyCode === 8) {
      this.registerOnChange(valor);
      return;
    }

    let pad = this.textMask.replace(/\D/g, '').replace(/9/g, '_');
    $event.target.value = this.aplicarMascara(valor);
    if (valor.length <= pad.length) {
      this.registerOnChange(valor);
    }
  }

  @HostListener('blur', ['$event'])
  onBlur($event: any) {
    if ($event.target.value.length === this.textMask.length) {
      return;
    }
    // this.registerOnChange('');
    // $event.target.value = '';
  }

  aplicarMascara(valor: string): string {
    valor = valor.replace(/\D/g, '');
    let pad = this.textMask.replace(/\D/g, '').replace(/9/g, '_');
    let valorMask = valor + pad.substring(0, pad.length - valor.length);
    let valorMaskPos = 0;

    valor = '';
    for (let i = 0; i < this.textMask.length; i++) {
      if (isNaN(parseInt(this.textMask.charAt(i)))) {
        valor += this.textMask.charAt(i);
      } else {
        valor += valorMask[valorMaskPos++];
      }
    }

    if (valor.indexOf('_') > -1) {
      valor = valor.substr(0, valor.indexOf('_'));
    }
    return valor;
  }

}
