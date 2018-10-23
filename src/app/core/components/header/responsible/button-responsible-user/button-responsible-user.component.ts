import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Responsible } from '../../../../../modules/scholarship/models/responsible';
import { auth } from '../../../../../auth/auth';

@Component({
  selector: 'app-button-responsible-user',
  templateUrl: './button-responsible-user.component.html',
  styleUrls: ['./button-responsible-user.component.scss']
})
export class ButtonResponsibleUserComponent implements OnInit {

  responsible: Responsible;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCurrentResponsible();
  }

  private loadCurrentResponsible(): void {
    this.responsible = auth.getCurrentResponsible();
  }

  public logoff(): void {
    this.router.navigate(['/educacao']);
    auth.logoffResponsible();
  }

}
