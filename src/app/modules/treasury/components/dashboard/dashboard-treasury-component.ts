import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { TreasuryService } from '../../treasury.service';
import { AuthService } from '../../../../shared/auth.service';

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
  chartColors = [{ backgroundColor: ['#03a9f4', '#76d275', '#ffc947', '#f44336'] }];

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
  // Subscription
  getDataSubscription: Subscription;
  mediaSubscription: Subscription;

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

  constructor(
    private authService: AuthService,
    private media: ObservableMedia,
    private service: TreasuryService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.mediaSubscription = this.media.subscribe((change: MediaChange) => setTimeout(() => this.isMobile = change.mqAlias === 'xs'));
    this.getDataSubscription = this.getDashboardData(0);
    this.service.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  getDashboardData(idAnalyst) {
    const unit = this.authService.getCurrentUnit();
    return this.service.getTreasuryDashboard(unit.id, idAnalyst).subscribe((data) => {
      if (data) {
        this.getChartObservationData(data.chartObservationData);
        this.getChartTreasurersData(data.chartTreasurersData);
        this.getCardChurchesData(data.cardChurchesData);
        this.getCardDistrictsData(data.cardDistrictsData);
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
      'Tesoureir(a) Associado(a)',
      'Tesoureiro Assistente',
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

