import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {

  msg = 'Informamos que a partir de sexta-feira (01/03) o suporte será realizado apenas pelo e-mail (suporteproes@forlogic.net)';

  showBar = true;

  constructor() {}

  ngOnInit() {
    if ('showBar' in sessionStorage) {
      this.showBar = sessionStorage.getItem('showBar') === 'true';
    }
  }

  closeNotificationBar() {
    this.showBar = false;
    sessionStorage.setItem('showBar', 'false');
  }

}
