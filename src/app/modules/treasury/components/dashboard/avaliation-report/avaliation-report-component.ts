import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';

import { Subject ,  Subscription } from 'rxjs';

import { TreasuryService } from '../../../treasury.service';
import { auth } from '../../../../../auth/auth';
import { ReportService } from '../../../../../shared/report.service';
import { utils } from '../../../../../shared/utils';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
    selector: 'app-avaliation-report',
    templateUrl: './avaliation-report-component.html',
    styleUrls: ['./avaliation-report-component.scss']
})
@AutoUnsubscribe()
export class AvaliationReportComponent implements OnInit, OnDestroy {

  getrankingReportData: Subscription;
  subsSearch: Subscription;
  subsReport: Subscription;
  avaliationReport: any;
  dataAvaliationReport: any;
  search$ = new Subject<string>();
  searchButton = false;
  totalRequirementsAnual = 0;
  totalRequirementsMonth: any;
  showList = 15;
  filterActive = false;
  filterYear = 2018;
  years: number[] = new Array<number>();
  searchFilter = '';

  constructor(
      private service: TreasuryService,
      public dialogRef: MatDialogRef<AvaliationReportComponent>,
      public snackBar: MatSnackBar,
      private reportService: ReportService
  ) { }


  ngOnInit() {
    this.getYearsOfFilter();
    this.subsSearch = this.search$.subscribe(search => {
        this.avaliationReport = this.search(search);
    });
    this.getrankingReportData = this.getAvaliationData();
  }

  ngOnDestroy(): void {
  }

  cancel() {
    this.dialogRef.close(false);
  }

  getAvaliationData() {
    const { id } = auth.getCurrentUnit();
    return this.service.getAvaliationRaking(id, this.filterYear).subscribe((data: any) => {
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
        this.dataAvaliationReport = data;
        this.avaliationReport = this.search(this.searchFilter);
    });
  }

  public search(search: string): any[] {
    this.searchFilter = search;
    if (search === '' || search === undefined || search === null) {
        return this.dataAvaliationReport;
    } else {
      return this.dataAvaliationReport.filter(p =>
          utils.buildSearchRegex(search).test(p.position) ||
          utils.buildSearchRegex(search).test(p.name) ||
          utils.buildSearchRegex(search).test(p.notes)  ||
          utils.buildSearchRegex(search).test(p.score)  ||
          utils.buildSearchRegex(search).test(p.t)  ||
          utils.buildSearchRegex(search).test(p.church_name)  ||
          utils.buildSearchRegex(search).test(p.district_name)
        );
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

    public filterTreasurerEvaluated(): void {
        this.filterActive = !this.filterActive;
    }

    private getYearsOfFilter(): void {
        const currentYear = new Date().getFullYear();
        for (let i = this.filterYear; i <= currentYear; i++) {
            this.years.push(i);
        }
        this.filterYear = currentYear;
    }

    public getDataOfTreasurers(): void {

    }
}
