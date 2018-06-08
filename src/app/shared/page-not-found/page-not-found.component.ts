import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ChangePasswordComponent } from '../../core/components/password/change-password/change-password.component';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['../layout/layout.component.scss', 'page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  get year(): number { return new Date().getFullYear(); }
  dialogRef: MatDialogRef<ChangePasswordComponent>;

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  logoff() {
    this.authService.logoff();
  }

  changePassword() {
    this.dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '400px',
      height: '500px'
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if (!result) { return; }
    });
  }

}
