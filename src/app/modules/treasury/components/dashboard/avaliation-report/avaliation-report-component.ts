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
        });

        this.search$.subscribe(search => {
            this.avaliationReport = this.search(search);
        });
    }

    cancel() {
        this.dialogRef.close(false);
    }

    generateGeneralReport() {
        window.print();
    }

    public search(search: string): any[] {
        if (search === '' || search === undefined || search === null) {
            return this.avaliationReport;
        } else {
            return this.avaliationReport.filter(data => {
                return data.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
            });
        }
    }
}
