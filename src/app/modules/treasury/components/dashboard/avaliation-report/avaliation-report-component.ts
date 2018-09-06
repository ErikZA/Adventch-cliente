import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TreasuryService } from '../../../treasury.service';
import { Subscription } from 'rxjs/Subscription';
import { auth } from '../../../../../auth/auth';
import { Subject } from 'rxjs/Subject';



@Component({
    selector: 'app-avaliation-report',
    templateUrl: './avaliation-report-component.html',
    styleUrls: ['./avaliation-report-component.scss']
})
export class AvaliationReportComponent implements OnInit {

    getrankingReportData: Subscription;
    getTotalReportData: Subscription;
    avaliationReport: any;
    dataAvaliationReport: any;
    search$ = new Subject<string>();
    searchButton = false;
    totalRequirementsAnual = 0;
    totalRequirementsMonth: any;
    showList = 15;

    constructor(
        private service: TreasuryService,
        private router: Router,
        public dialogRef: MatDialogRef<AvaliationReportComponent>,
        public snackBar: MatSnackBar
    ) { }


    ngOnInit() {
        const unit = auth.getCurrentUnit();
        this.getTotalReportData = this.getTotalAvaliationScore(unit.id);
        this.search$.subscribe(search => {
            this.avaliationReport = this.search(search);
        });
        this.getrankingReportData = this.getAvaliationData(unit.id);
    }

    cancel() {
        this.dialogRef.close(false);
    }

    getAvaliationData(id) {
        return this.service.getAvaliationRaking(id).subscribe((data) => {
            let previousNote;
            let position = 0;
            data.forEach(element => {
                if (element.notes === previousNote) {
                    element.position = position;
                } else {
                    position++;
                    element.position = position;
                }
                element.notes = element.notes / element.score;
                previousNote = element.notes;
            });
            this.avaliationReport = data;
            this.dataAvaliationReport = this.avaliationReport;
        });
    }

    getTotalAvaliationScore(id) {
        return this.service.getTotalAvaliationScore(id).subscribe((data) => {
            data.forEach(dataReq => {
                dataReq.isAnual ?
                this.totalRequirementsAnual = dataReq.totalScore :
                this.totalRequirementsMonth = dataReq.totalScore;
            });
        });
    }

    generateGeneralReport() {
        // Temporário
        const printContents = document.getElementById('printable').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        location.reload();
    }

    public search(search: string): any[] {
        if (search === '' || search === undefined || search === null) {
            return this.dataAvaliationReport;
        } else {
            return this.avaliationReport.filter(data => {
                return data.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            });
        }
    }

    public onScroll(): void {
        this.showList += 15;
      }
}
