import { Component, OnInit } from '@angular/core';
import { Responsible } from '../../../models/responsible';
import { AuthService } from '../../../../shared/auth.service';
import { Process } from '../../../models/process';

@Component({
  selector: 'app-responsible-data',
  templateUrl: './responsible-data.component.html',
  styleUrls: ['./responsible-data.component.scss']
})
export class ResponsibleDataComponent implements OnInit {
  responsible: Responsible;
  processes: Process;
  showList = 15;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadCurrentResponsible();
    this.loadProcess();
  }

  loadCurrentResponsible(){
    this.responsible = this.authService.getcurrentResponsible();
  }

  loadProcess(){

  }

  logoff(){
    this.authService.logoffResponsible();
  }

  /*
  AutoScroll
   */
  onScroll() {
    this.showList += 15;
  }
}
