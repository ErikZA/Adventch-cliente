import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from '../../../../auth/auth';
import { User } from './../../../../shared/models/user.model';

@Component({
  selector: 'app-button-user',
  templateUrl: './button-user.component.html',
  styleUrls: ['./button-user.component.scss']
})
export class ButtonUserComponent implements OnInit {

  user: User;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  private getCurrentUser(): void {
    this.user = auth.getCurrentUser();
    if (!this.user) {
      this.logoff();
    }
  }

  public changeProfile(): void {
    this.router.navigate(['/perfil/editar']);
  }

  public releaseNotes(): void {
    this.router.navigate(['/notas-da-versao']);
  }

  public logoff() {
    this.router.navigate(['/login']);
    auth.logoffMain();
  }

}
