import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-responsible',
  templateUrl: './footer-responsible.component.html',
  styleUrls: ['./footer-responsible.component.scss']
})
export class FooterResponsibleComponent implements OnInit {

  get year(): number { return new Date().getFullYear(); }

  constructor() { }

  ngOnInit() {
  }

}
