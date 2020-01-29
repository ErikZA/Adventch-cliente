import { Component } from '@angular/core';
import { SnackBarService } from './shared/snack-bar/snack-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'events-client';

  constructor(
    public snakcbar: SnackBarService
  ) { }

  open() {
    this.snakcbar.open("check_circle", "mensage de teste", 2000, "success")
  }

}
