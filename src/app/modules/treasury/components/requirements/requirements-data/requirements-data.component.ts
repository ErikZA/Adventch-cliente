import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { RequirementStore } from '../requirements.store';
import { Requirement } from '../../../models/requirement';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../../../../../shared/auth.service';
import { Observation } from '../../../models/observation';
import { auth } from '../../../../../auth/auth';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { ReportService } from '../../../../../shared/report.service';


@Component({
  selector: 'app-requirements-data',
  templateUrl: './requirements-data.component.html',
  styleUrls: ['./requirements-data.component.scss']
})
export class RequirementDataComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  requirements$: Observable<Requirement[]>;
  search$ = new Subject<string>();
  subscribeUnit: Subscription;
  requirements: Requirement[];
  showList = 15;

  filterText: string;
  filterIsAnual: number;
  filterPeriodStart: Date = new Date(new Date().getFullYear(), 0, 1);
  filterPeriodEnd: Date = new Date(new Date().getFullYear(), 11, 31);

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private sidenavService: SidenavService,
    public store: RequirementStore,
    private confirmDialogService: ConfirmDialogService,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.getData();
    this.router.navigate([this.router.url.replace(/.*/, 'tesouraria/requisitos')]);
    this.sidenavService.setSidenav(this.sidenavRight);
    this.subscribeUnit = auth.currentUnit.subscribe(() => {
      this.getData();
    });
    this.search$.subscribe(search => {
      this.filterText = search;
      this.search();
    });
  }


  public onScroll() {
    this.showList += 15;
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  private getData() {
    this.requirements$ = this.store.requirements$;
    this.store.loadAll();
    // VERIFICAR
    // this.requirements = this.store.dataStore.requirements;
    // this.requirements$.subscribe(() => {
    //   this.setObservables();
    //   this.store.loadFilters();
    //   setTimeout(() => {
    //     this.search();
    //   }, 200);
    // });
  }

  /* Usados pelo component */
  public closeSidenav() {
    this.sidenavService.close();
    this.router.navigate(['tesouraria/requisitos']);
  }

  public openSidenav() {
    this.sidenavService.open();
  }

  edit(requirement: Requirement) {
    if (requirement.id === undefined) {
      return;
    }
    this.store.openRequirement(requirement);
    this.router.navigate(['tesouraria/requisitos/' + requirement.id + '/editar']);
    // this.searchButton = false;
    this.requirements$ = this.store.requirements$;
    this.sidenavRight.open();
  }

  public remove(requirement: Requirement) {
    this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover esse requisito?', 'REMOVER')
      .subscribe(res => {
        if (res) {
          this.store.remove(requirement);
        }
      });
  }

  public search() {
    let requirements = this.store.searchText(this.filterText);
    // tslint:disable-next-line:triple-equals
    if (this.filterIsAnual !== undefined && this.filterIsAnual != null && this.filterIsAnual != 0) {
      const filter = this.filterIsAnual === 1 ? true : false;
      requirements = this.store.searchStatus(filter, requirements);
    }
    requirements = this.store.searchInDates(this.filterPeriodStart, this.filterPeriodEnd, requirements);
    this.requirements$ = Observable.of(requirements);
  }

  ngOnDestroy() {

  }



  public generateGeneralReport(): void {
    const data = this.getDataParams();
    this.reportService.reportRequirementsGeral(data).subscribe(urlData => {
      const fileUrl = URL.createObjectURL(urlData);
        let element;
        element = document.createElement('a');
        element.href = fileUrl;
        element.download = 'requisitos-relatorio_geral.pdf';
        element.target = '_blank';
        element.click();
        //this.snackBar.open('Gerando relatório!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
        //this.snackBar.open('Erro ao gerar relatório relatório!', 'OK', { duration: 5000 });
    });
  }

  private getDataParams(): any {
    return {
      isAnual: this.filterIsAnual,
      period: new Date(this.filterPeriodStart).getFullYear(),
      typeName: this.getTypeName()
    };
  }

  private getTypeName(): string {
    if (this.filterIsAnual === 0) {
      return "TODOS";
    }
    if (this.filterIsAnual === 1) {
      return "Anual";
    }
    return "Mensal";
  }
}
