import { Component, OnInit, Input } from '@angular/core';
import { ELoginType } from '../models/ELoginType.enum';

@Component({
  selector: 'app-container-image',
  templateUrl: './container-image.component.html',
  styleUrls: ['./container-image.component.scss']
})
export class ContainerImageComponent implements OnInit {

  @Input() login: number;

  constructor() { }

  ngOnInit() {
  }

  public getClassNameLoginType(): string {
    const type = Number(this.login);
    switch (type) {
      case ELoginType.LoginMain:
        return 'login-main';
      case ELoginType.LoginEducation:
        return 'login-education';
      default:
        return 'login-main';
    }
  }
}
