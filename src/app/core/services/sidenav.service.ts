import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SidenavService {
  toggle = new EventEmitter();
  constructor() { }

  toggleSideNav() {
    this.toggle.emit();
  }
}
