import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import { TreasuryService } from '../../../treasury.service';
import { Subscription } from 'rxjs/Subscription';
import { auth } from '../../../../../auth/auth';
import { ReportService } from '../../../../../shared/report.service';



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
    searchButton = false;
    totalRequirementsAnual = 0;
    totalRequirementsMonth: any;
    showList = 15;

    constructor(
        private service: TreasuryService,
        private router: Router,
        public dialogRef: MatDialogRef<AvaliationReportComponent>,
        public snackBar: MatSnackBar,
        private reportService: ReportService
    ) { }


    ngOnInit() {
        const unit = auth.getCurrentUnit();
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
            let previousNote = 0;
            let position = 0;
            data.forEach(element => {
                if (element.t.toFixed(2) === previousNote.toFixed(2)) {
                    element.position = position;
                } else {
                    position++;
                    element.position = position;
                }
                previousNote = element.notes / element.score;
            });
            this.avaliationReport = data;
            this.dataAvaliationReport = this.avaliationReport;
        });
    }

    /*generateGeneralReport() {
        // Temporário
        const printContents = document.getElementById('printable').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        location.reload();
    }*/

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

    public generateGeneralReport(): void {
        const data = this.getDataParams();
        this.reportService.reportAvaliationDashboard(data).subscribe(urlData => {
            const fileUrl = URL.createObjectURL(urlData);
            let element;
            element = document.createElement('a');
            element.href = fileUrl;
            element.download = 'avaliacoes-relatorio_dashboard.pdf';
            element.target = '_blank';
            element.click();
            this.snackBar.open('Gerando relatório!', 'OK', { duration: 5000 });
        }, err => {
            console.log(err);
            this.snackBar.open('Erro ao gerar relatório relatório!', 'OK', { duration: 5000 });
        });
    }

    private getDataParams(): any {
        return {
            year: new Date().getFullYear(),
        };
    }
}
