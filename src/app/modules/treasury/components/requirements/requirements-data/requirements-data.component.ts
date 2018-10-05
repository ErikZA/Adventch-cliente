
import { MatSnackBar } from '@angular/material';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription, Subject } from 'rxjs';

import { RequirementDataInterface } from '../../../interfaces/requirement/requirement-data-interface';
import { RequirementStore } from '../requirements.store';
import { auth } from '../../../../../auth/auth';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { ReportService } from '../../../../../shared/report.service';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { AutoUnsubscribe } from '../../../../../shared/auto-unsubscribe-decorator';
import { map, tap, switchMap, skipWhile } from 'rxjs/operators';
import { RequirementsService } from '../requirements.service';
import { Filter } from '../../../../../core/components/filter/Filter.model';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';
import { utils } from '../../../../../shared/utils';

@Component({
  selector: 'app-requirements-data',
  templateUrl: './requirements-data.component.html',
  styleUrls: ['./requirements-data.component.scss']
})
@AutoUnsubscribe()
export class RequirementDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = '/tesouraria/requisitos';

  search$ = new Subject<string>();
  subscribeUnit: Subscription;
  requirements: RequirementDataInterface[];
  showList = 40;
  searchButton = false;

  filterText: string;
  requirementsCache: RequirementDataInterface[];
  subGetData: Subscription;

  // new filter
  typesSelecteds: number[] = [];
  typesData: Filter[] = [];
  yearsSelecteds: number[] = [];
  yearsData: Filter[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public store: RequirementStore,
    private confirmDialogService: ConfirmDialogService,
    private reportService: ReportService,
    private requirementsService: RequirementsService,
    private snackBar: MatSnackBar,
    private filterService: FilterService
  ) { super(router); }

  ngOnInit() {
    this.loadTypes();
    this.loadPeriods();
    this.subGetData = this.getData()
      .pipe(
      switchMap(() => this.search$)
      ).subscribe(search => {
        this.filterText = search;
        this.search();
      });
  }

  ngOnDestroy(): void {
  }
  public onScroll() {
    this.showList += 80;
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public getData() {
    const { id } = auth.getCurrentUnit();
    return this.requirementsService
      .getRequirements(id)
      .pipe(
      map(p => p.sort((a, b) => a.position - b.position)),
      tap((data: RequirementDataInterface[]) => {
        this.requirements = data;
        this.requirementsCache = data;
      })
      );
  }

  private loadPeriods() {
    const currentYear = new Date().getFullYear();
    for (let i = 2018; i <= currentYear; i++) {
      this.yearsData.push(new Filter(i, i.toString()));
    }
  }

  public edit(requirement: RequirementDataInterface) {
    if (requirement.id === undefined) {
      return;
    }
    this.router.navigate([requirement.id, 'editar'], { relativeTo: this.route });
  }

  public remove(requirement: RequirementDataInterface) {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este requisito?', 'REMOVER')
      .pipe(
      skipWhile(res => res !== true),
      switchMap(() => this.requirementsService.deleteRequirement(requirement.id)),
      switchMap(() => this.getData()),
      tap(() => this.snackBar.open('Removido com sucesso', 'OK', { duration: 30000 }))
      ).subscribe();
  }

  public search() {
    let requirementsFilttered = this.requirementsCache.filter(t =>
      utils.buildSearchRegex(this.filterText).test(t.name.toUpperCase()) ||
      utils.buildSearchRegex(this.filterText).test(t.description.toUpperCase()) ||
      utils.buildSearchRegex(this.filterText).test(t.position.toString().toUpperCase()) ||
      utils.buildSearchRegex(this.filterText).test(t.score.toString().toUpperCase())
    );
    requirementsFilttered = this.searchStatus(requirementsFilttered);
    requirementsFilttered = this.searchYear(requirementsFilttered);
    this.requirements = requirementsFilttered;
  }

  private searchStatus(requirementsFilttered): RequirementDataInterface[] {
    if (this.typesSelecteds.length === 2 || this.typesSelecteds.length === 0) {// Todos ou nenhum
      return requirementsFilttered;
    }
    if (this.typesSelecteds[0] === 1) {
      return requirementsFilttered.filter(f => f.isAnual);
    }
    return requirementsFilttered.filter(f => !f.isAnual);
  }

  private searchYear(requirementsFilttered: RequirementDataInterface[]): RequirementDataInterface[] {
    if (this.yearsSelecteds.length === 0) {
      return requirementsFilttered;
    }
    return requirementsFilttered.filter(f =>  this.checkYear(f.date));
  }

  private checkYear(date): boolean {
    return this.yearsSelecteds.some(s => s === new Date(date).getFullYear());
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
      // this.snackBar.open('Gerando relatório!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      // this.snackBar.open('Erro ao gerar relatório relatório!', 'OK', { duration: 5000 });
    });
  }

  private getDataParams(): any {
    let type = new Filter(-1, 'TODOS');
    const year = this.yearsData.find(f => f.id === this.typesSelecteds[0]);
    if (this.typesSelecteds.length === 1) {
      type = this.typesData.find(f => f.id === this.typesSelecteds[0]);
    }
    return {
      isAnual: type.id,
      period: year === undefined ? this.yearsData[0].id : year.id,
      typeName: type.name
    };
  }

  checkTypes(type): void {
    this.typesSelecteds = this.filterService.check(type, this.typesSelecteds);
    this.search();
  }

  checkYears(year): void {
    this.yearsSelecteds = this.filterService.check(year, this.yearsSelecteds);
    this.search();
  }

  private loadTypes(): void {
    this.typesData.push(new Filter(1, 'Anual'));
    this.typesData.push(new Filter(0, 'Mensal'));
  }

  public disableReport(): boolean {
    const types = this.typesSelecteds.length === 0
    || this.typesSelecteds.length === 1
    || this.typesSelecteds.length === this.typesData.length;
    const years = (this.yearsData.length === 1 && this.yearsSelecteds.length === 0) || this.yearsSelecteds.length === 1;
    if (types && years) {
      return false;
    }
    return true;
  }
}
