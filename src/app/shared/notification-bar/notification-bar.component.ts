import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {

  msg = 'Devido a baixa adesão do chat online, a partir de segunda-feira (11) o atendimento será realizado apenas por e-mail e telefone.';

  showBar = true;

  constructor() {}

  ngOnInit() {
  }

  closeNotificationBar() {
    this.showBar = false;
  }

}
