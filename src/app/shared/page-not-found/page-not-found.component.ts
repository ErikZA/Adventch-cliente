import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { auth } from './../../auth/auth';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['../layout/layout.component.scss', 'page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  get year(): number { return new Date().getFullYear(); }

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logoff() {
    this.router.navigate(['/login']);
    auth.logoffMain();
  }

}
