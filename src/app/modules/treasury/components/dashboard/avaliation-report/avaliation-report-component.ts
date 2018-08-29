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
    avaliationReport: any;
    dataAvaliationReport: any;
    search$ = new Subject<string>();

    constructor(
        private service: TreasuryService,
        private router: Router,
        public dialogRef: MatDialogRef<AvaliationReportComponent>,
        public snackBar: MatSnackBar
    ) { }


    ngOnInit() {
        const unit = auth.getCurrentUnit();
        this.getrankingReportData = this.service.getAvaliationRaking(unit.id).subscribe((data) => {

            let previousNote;
            let position = 0;
            data.forEach(element => {
                if (element.notes === previousNote) {
                    element.position = position;
                } else {
                    position++;
                    element.position = position;
                }
                previousNote = element.notes;
            });
            this.avaliationReport = data;
            this.dataAvaliationReport = this.avaliationReport;
        });

        this.search$.subscribe(search => {
            this.avaliationReport = this.search(search);
        });
    }

    cancel() {
        this.dialogRef.close(false);
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
}
