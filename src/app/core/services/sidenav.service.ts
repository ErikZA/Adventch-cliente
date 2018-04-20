import { Injectable, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class SidenavService {
  toggle = new EventEmitter();
  constructor() { }

  toggleSideNav() {
    this.toggle.emit();
  }
}
