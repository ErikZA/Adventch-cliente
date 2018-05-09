import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Treasurer } from '../../../treasury/models/treasurer';
import { Observable } from 'rxjs/Observable';
import { TreasuryService } from '../../../treasury/treasury.service';
import { Process } from '../../models/process';
import { Student } from '../../models/student';
import { Responsible } from '../../models/responsible';
import { ScholarshipService } from '../../scholarship.service';
import { ScholarshipComponent } from '../scholarship.component';
import { AuthService } from '../../../shared/auth.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { PendencyComponent } from '../pendency/pendency.component';

@Component({
  selector: 'app-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.scss']
})
export class ProcessDataComponent implements OnInit {
  searchButton: boolean = false;
  search$ = new Subject<string>();
  showList: number = 15;
  showSchool: boolean = false;

  processes: Process[] = new Array<Process>();
  processes$: Observable<Process[]>;
  
  dialogRef: MatDialogRef<PendencyComponent>;

  constructor(    
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getData();
    this.search$.subscribe(search => {
      this.searchTreasurers(search);
    });
  }

  getData(){
    this.processes = [];
    var idSchoolSelected = this.scholarshipService.schoolSelected;
    this.showSchool = idSchoolSelected == '-1';
    if(idSchoolSelected == '-1' && this.authService.getCurrentUser().idSchool != 0){
      idSchoolSelected = this.authService.getCurrentUser().idSchool.toString();
      this.showSchool = false;
    }

    this.scholarshipService.getProcess(idSchoolSelected).subscribe((data: Process[]) =>{
      this.processes = Object.assign(this.processes, data as Process[]);
      this.processes.forEach(
        item => {
          item.statusString = this.getStatusToString(item.status);
        }
      );
      this.processes$ = Observable.of(this.processes);
    })
  }  
  
  getStatusToString(status){
    if(status == 1)
      return 'Aguardando início';
    if(status == 2)
      return 'Em análise';
    if(status == 3)
      return 'Pendente';
    if(status == 4)
      return 'Aguardando vaga';
    if(status == 5)
      return 'Vaga liberada (50%)';
    if(status == 6)
      return 'Vaga liberada (100%)';
    if(status == 7)
      return 'Bolsa Indeferida';
  }

  searchTreasurers(search) {
    if (search === '' || search === undefined || search === null) {
      this.processes$ = Observable.of(this.processes);
    } else {
      this.processes$ = Observable.of(this.processes.filter(data => {
        return data.student.name.toLowerCase().indexOf(search) !== -1 || 
          data.student.responsible.name.toLowerCase().indexOf(search) !== -1 || 
          data.student.school.name.toLowerCase().indexOf(search) !== -1 ||
          data.statusString.toLowerCase().indexOf(search) !== -1 ||
          data.protocol.toLowerCase().indexOf(search) !== -1;
      }));
    }
  }

  onScroll() {
    this.showList += 15;
  }

  toWaiting(process){

  }

  toPendency(process){ 
    this.scholarshipService.updateProcess(process);
    this.dialogRef = this.dialog.open(PendencyComponent, {
      width: '70%'
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.updateProcess(this.scholarshipService.processSelected[0]);
      if (!result) 
        return;
    });
  }

  toReject(process){

  }

  toApprove(process){

  }

  updateProcess(newProcess){
    var index = this.processes.findIndex(f => f.id == newProcess.id);
    //this.processes.splice(index, 1);  
    newProcess.statusString = this.getStatusToString(newProcess.status);
    this.processes[index] = newProcess;
  }
}
