import { Component, OnInit } from '@angular/core';
import { Process } from '../../../models/process';
import { ScholarshipService } from '../../../scholarship.service';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from '../../../../shared/auth.service';
@Component({
  selector: 'app-report-new-process',
  templateUrl: './report-new-process.component.html',
  styleUrls: ['./report-new-process.component.scss']
})
export class ReportNewProcessComponent implements OnInit {
  public process: Process = new Process();  
  public displayedColumns = ['name', 'typeDocument'];
  public dataSource = new MatTableDataSource();

  constructor(
    public scholarshipService: ScholarshipService,
    public authService: AuthService
  ) {}

   public setProcess(process){
     this.process = process;
   }

  ngOnInit() {
    this.process = this.scholarshipService.getReport();
    this.dataSource = new MatTableDataSource(this.process.processDocuments);
  }

  printToCart(printSectionId: string){
    let popupWinindow
    let innerContents = document.getElementById(printSectionId).innerHTML;
    popupWinindow = window.open('', '_blank');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
}

}
