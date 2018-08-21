import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

import { Subject, Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../../../../shared/auth.service';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { Avaliation, AvaliationList } from '../../../models/avaliation';
import { auth } from '../../../../../auth/auth';
import { AvaliationStore } from '../avaliation.store';
import { AvaliationRequirement } from '../../../models/avaliationRequirement';
import { EAvaliationStatus } from '../../../models/Enums';
import { TreasuryService } from '../../../treasury.service';
import { Districts } from '../../../models/districts';
import { User } from '../../../../../shared/models/user.model';
import { Requirement } from '../../../models/requirement';
import { ReportService } from '../../../../../shared/report.service';
@Component({
  selector: 'app-avaliation-data',
  templateUrl: './avaliation-data.component.html',
  styleUrls: ['./avaliation-data.component.scss']
})
export class AvaliationDataComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();
  subscribeUnit: Subscription;
  layout: String = 'row';

  filterText: string;
  filterStatus = 0;
  filterAnalyst = 0;
  filterDistrict = 0;
  filterPeriod = 0;

  districts: Districts[] = new Array<Districts>();
  analysts: User[] = new Array<User>();
  requirements: number[] = new Array<number>();
  
  avaliations$: Observable<AvaliationList[]>;
  avaliations: AvaliationList[] = new Array<AvaliationList>();

  constructor(
    private service: TreasuryService,
    private authService: AuthService,
    private sidenavService: SidenavService,
    private router: Router,
    private route: ActivatedRoute,
    private store: AvaliationStore,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.getData();
    this.router.navigate([this.router.url.replace(/.*/, 'tesouraria/avaliacoes')]);
    this.search$.subscribe(search => {
      this.filterText = search;
      this.search();
    });
    this.subscribeUnit = auth.currentUnit.subscribe(() => {
      this.getData();
      this.closeSidenav();
    });
    this.sidenavService.setSidenav(this.sidenavRight);
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  getData() {
    this.avaliations$ = this.store.avaliations$;
    this.store.loadAll();
    this.loadFilters();
  }

  private loadFilters() {
    this.loadDistricts();
    this.loadAnalysts();
    this.loadPeriods();
  }

  private loadDistricts() {
    this.service.getDistricts(auth.getCurrentUnit().id).subscribe((data: Districts[]) => {
      this.districts = data;
    });
  }

  private loadAnalysts() {
    this.service.loadAnalysts(auth.getCurrentUnit().id).subscribe((data: User[]) => {
      this.analysts = data;
    });
  }

  private loadPeriods() {
    this.service.getRequirements(auth.getCurrentUnit().id).subscribe((data: Requirement[]) => {
      let years = new Array<number>();
      data.forEach(element => {
        years.push(new Date(element.date).getFullYear());
      });
      this.requirements = Array.from(new Set(years));
      this.setPeriod();
    });
  }

  private setPeriod() {
    if (this.requirements.length === 1) {
      this.filterPeriod = this.requirements[0];
    } else if (this.requirements.length > 1) {
      this.filterPeriod = this.requirements.sort(function(a, b){return (b > a ? 1 : -1)})[0];
    }
  }

  /* Usados pelo component */
  closeSidenav() {
    this.sidenavService.close();
    this.router.navigate(['tesouraria/avaliacoes']);
  }

  onScroll() {
    this.showList += 15;
  }

  openSidenav() {
    this.sidenavService.open();
  }

  mensal(avaliation: Avaliation) {
    this.store.avaliation = avaliation;
    this.store.isMensal = true;
    this.router.navigate([avaliation.id, 'avaliar'], { relativeTo: this.route });
    this.openSidenav();
    /*this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover a igreja?', 'REMOVER')
      .subscribe(res => {
        if (res) {
          this.store.remove(church.id);
        }
      });*/
  }

  anual(avaliation: Avaliation) {
    this.store.avaliation = avaliation;
    this.store.isMensal = false;
    this.router.navigate([avaliation.id, 'avaliar'], { relativeTo: this.route });
    this.openSidenav();
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public search() {
    let avaliations = this.store.searchText(this.filterText);

    if (this.filterDistrict !== undefined && this.filterDistrict !== null && this.filterDistrict != 0) {
      avaliations = this.store.searchDistricts(this.filterDistrict, avaliations);
    }

    if (this.filterAnalyst !== undefined && this.filterAnalyst !== null && this.filterAnalyst != 0) {
      avaliations = this.store.searchAnalysts(this.filterAnalyst, avaliations);
    }

    if (this.filterPeriod !== undefined && this.filterPeriod !== null && this.filterPeriod != 0) {
      avaliations = this.store.searchPeriods(this.filterPeriod.toString(), avaliations);
    }
    this.avaliations$ = Observable.of(avaliations);
  }

  public getStatusString(status: EAvaliationStatus): string {
    switch (status) {
      case EAvaliationStatus.Valued:
        return "Avaliado";
      case EAvaliationStatus.Finished:
        return "Finalizado";
      default:
        return "Aguardando";
    }
  }

  public generateGeneralReport(): void {
    const data = this.getDataParams();
    this.reportService.reportAvaliationsGeral(data).subscribe(urlData => {
      const fileUrl = URL.createObjectURL(urlData);
        let element;
        element = document.createElement('a');
        element.href = fileUrl;
        element.download = 'avaliacoes-relatorio_geral.pdf';
        element.target = '_blank';
        element.click();
        //this.snackBar.open('Gerando relatório!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
        //this.snackBar.open('Erro ao gerar relatório relatório!', 'OK', { duration: 5000 });
    });
  }

  private getDataParams(): any {
    const district = this.districts.find(f => f.id === this.filterDistrict);
    const analyst = this.analysts.find(f => f.id === this.filterAnalyst);
    const period = this.filterPeriod;
    return {
      statusId: this.filterStatus,
      statusName: this.getStatusString(this.filterStatus),
      districtId: this.filterDistrict,
      districtName: district === undefined ? 'TODOS' : district.name,
      analystId: this.filterAnalyst,
      analystName: analyst === undefined ? 'TODOS' : analyst.name,
      period: period,
    };
  }
}
