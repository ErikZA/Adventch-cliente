import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {

  msg = 'Em caso de dúvidas enviar email para help@adven.tech';

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
