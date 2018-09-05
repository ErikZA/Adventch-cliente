import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';

import { Subscription } from 'rxjs/Subscription';

import { TreasuryService } from '../../treasury.service';
import { auth } from '../../../../auth/auth';
import { MatDialog } from '@angular/material';
import { AvaliationReportComponent } from './avaliation-report/avaliation-report-component';

@Component({
  selector: 'app-dashboard-treasury',
  templateUrl: './dashboard-treasury-component.html',
  styleUrls: ['./dashboard-treasury.component.scss']
})
export class DashboardTreasuryComponent implements OnInit {

  isMobile: boolean;
  users: any;
  // Chart Configurations
  // Adicione novas cores aqui, caso o gráfico fique com cor cinza
  chartColors = [{
    backgroundColor: ['#03a9f4',
      '#76d275',
      '#ffc947',
      '#f44336',
      '#6a5acd',
      '#922428',
      '##535154',
      '#948b3d',
      '#3d8294',
      '#3d9477']
  }];

  // Igrejas
  cardChurchesData: number;
  // Distritos
  cardDistrictsData: number;
  // Observações
  chartObservationTotal = 0;
  chartObservationData: number[] = [];
  chartObservationLabels: string[] = [];
  // Tesoureiros
  chartTreasurersTotal = 0;
  chartTreasurersData: number[] = [];
  chartTreasurersLabels: string[] = [];
  // Avaliações
  chartAvaliationsData: any[] = [];
  chartAvaliationsLabels: any[] = [];
  chartAvaliationsDatasets: any[];
  totalRequirements: any;
  // Subscription
  getDataSubscription: Subscription;
  mediaSubscription: Subscription;
  getAvaliationSubscription: Subscription;

  pieChartOptions: any = {
    options: {
      tooltips: {
        showAllTooltips: true,
      }
    },
    legend: {
      position: 'bottom'
    },
  };

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        stacked: true,
        ticks: {
          autoSkip: false
        }
      }],
      yAxes: [{
        stacked: true
      }]
    },
    title: {
      display: true,
    },
    plugins: {
      datalabels: {
        color: 'black',
        display: function (context) {
          return context.dataset.data[context.dataIndex] > 0;
        },
        font: {
          weight: 'bold'
        },
        formatter: Math.round
      }
    }
  };


  constructor(
    private media: ObservableMedia,
    private service: TreasuryService,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    const unit = auth.getCurrentUnit();
    this.getAvaliationSubscription = this.getAvaliationScore();
    this.mediaSubscription = this.media.subscribe((change: MediaChange) => setTimeout(() => this.isMobile = change.mqAlias === 'xs'));
    this.getDataSubscription = this.getDashboardData(0);
    this.service.getUsers(unit.id).subscribe((data) => {
      this.users = data;
    });
  }

  getDashboardData(idAnalyst) {
    const unit = auth.getCurrentUnit();
    return this.service.getTreasuryDashboard(unit.id, idAnalyst).subscribe((data) => {
      if (data) {
        this.getChartObservationData(data.chartObservationData);
        this.getChartTreasurersData(data.chartTreasurersData);
        this.getCardChurchesData(data.cardChurchesData);
        this.getCardDistrictsData(data.cardDistrictsData);
        this.getCardAvaliationsData(data.cardAvaliationData);
      }
    });
  }

  getAvaliationScore() {
    const unit = auth.getCurrentUnit();
    return this.service.getTotalAvaliationScore(unit.id).subscribe((data) => {
       data.forEach(dataReq => {
        this.totalRequirements = dataReq.totalScore;
      });
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AvaliationReportComponent, {
      height: '90%',
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });
  }

  getCardChurchesData(array) {
    array.forEach((f) => {
      if (f !== 0) {
        this.cardChurchesData = f.churches;
      }
    });
  }

  getCardDistrictsData(array) {
    array.forEach((f) => {
      if (f !== 0) {
        this.cardDistrictsData = f.districts;
      }
    });
  }

  getChartObservationData(array) {
    this.chartObservationData = [];
    this.chartObservationLabels = [];
    this.chartObservationTotal = 0;
    const labels = [
      'Aberta',
      'Fechada',
    ];
    array.forEach((f, i) => {
      if (f !== 0) {
        this.chartObservationTotal = this.chartObservationTotal + Number(f.status);
        this.chartObservationData.push(f.status);
        this.chartObservationLabels.push(labels[f.id_status - 1]);
      }
    });
  }

  getChartTreasurersData(array) {
    this.chartTreasurersData = [];
    this.chartTreasurersLabels = [];
    this.chartTreasurersTotal = 0;
    const labels = [
      'Tesoureiro(a)',
      'Associado(a)',
      'Assistente',
    ];
    array.forEach((f, i) => {
      if (f !== 0) {
        if (f.status !== 0) {
          this.chartTreasurersTotal = this.chartTreasurersTotal + Number(f.functions);
          this.chartTreasurersData.push(f.functions);
          this.chartTreasurersLabels.push(labels[f.id_function - 1]);
        }
      }
    });
  }

  getCardAvaliationsData(array: any) {
    this.chartAvaliationsData = [];
    this.chartAvaliationsLabels = [];
    // dados de presentes em cada coluna
    let fourth = 0;
    let third = 0;
    let second = 0;
    let first = 0;

    array.forEach((f, i) => {
      const val = f.notes / this.totalRequirements;
      if (val < 0.5) {
        fourth = fourth + f.ranking;
      } else
        if (val < 0.7) {
          third = third + f.ranking;
        } else
          if (val < 0.9) {
            second = second + f.ranking;
          } else
            if (val <= 1) {
              first = first + f.ranking;
            }
    });

    const value = [];
    const data = [];

    data.push(first);
    data.push(second);
    data.push(third);
    data.push(fourth);

    value.push({ data: data });
    this.chartAvaliationsData = value;
    this.chartAvaliationsLabels = ['100%-90%', '90%-70%', '70%-50%', '50%-0%'];
  }

  checkEmpty(array) {
    if (array) {
      return array.some(s => s !== 0 || s.length !== 0);
    }
    return false;
  }

  filter(user) {
    this.getDataSubscription = this.getDashboardData(user);
    this.changeDetector.markForCheck();
  }
}

