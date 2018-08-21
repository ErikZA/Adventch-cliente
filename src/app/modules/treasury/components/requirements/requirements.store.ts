import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import 'rxjs/add/observable/of';

import { TreasuryService } from '../../treasury.service';
import { AuthService } from '../../../../shared/auth.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observation } from '../../models/observation';
import { Requirement } from '../../models/requirement';
import * as moment from 'moment';
import { auth } from '../../../../auth/auth';


@Injectable()
export class RequirementStore {

    requirements$: Observable<Requirement[]>;
    private _requirements: BehaviorSubject<Requirement[]>;

    public dataStore: {
        requirements: Requirement[]
    };

    public requirements: Requirement;

    constructor(
        private service: TreasuryService,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {
        this.dataStore = {
            requirements: []
        };
        this.init();
        moment.locale('pt');
    }

    public init() {
        this._requirements = <BehaviorSubject<Requirement[]>>new BehaviorSubject([]);
        this.requirements$ = this._requirements.asObservable();
    }

    /* Abrir sidenav*/
    openRequirement(requirement) {
        this.requirements = requirement;
    }

    /* Listagem */
    public loadAll(): void {
        const unit = auth.getCurrentUnit();
        this.service.getRequirements(unit.id).subscribe((data: Requirement[]) => {
            this.dataStore.requirements = data;
            this._requirements.next(Object.assign({}, this.dataStore).requirements);
        });
        this.requirements$ = this._requirements.asObservable();
    }

      /* Salvar*/
  public addRequirement(requirement) {
    const index = this.dataStore.requirements.findIndex(x => x.id === Number(requirement.id));
    if (index >= 0) {
      this.dataStore.requirements[index] = requirement;
    } else {
      this.dataStore.requirements.push(requirement);
    }
    this.requirements = new Requirement();
  }

  public remove(requirement: Requirement) {
    this.service.deleteRequirement(requirement).subscribe(() => {
      const index = this.dataStore.requirements.findIndex(x => x.id === requirement.id);
      this.dataStore.requirements.splice(index, 1);
      this.snackBar.open('Requisito removido!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao remover requisito, tente novamente.', 'OK', { duration: 5000 });
    });
  }

    private load() {
        const { requirements } = this.dataStore;
        if (!requirements) { return; }
        // this.loadChurches();
        // this.loadAnalysts();
        // this.loadResponsibles();
    }

    public loadFilters() {
        this.load();
    }

    /* Filtro */
    public searchText(search: string): Requirement[] {
        if (search === '' || search === undefined || search === null) {
            return this.dataStore.requirements;
        } else {
            return this.dataStore.requirements.filter(data => {
                return data.description.toLowerCase().indexOf(search.toLowerCase()) !== -1
                    || data.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
                    || data.description.toLowerCase().indexOf(search.toLowerCase()) !== -1
                    || moment(data.date).format('DD/MM/YYYY').toString().indexOf(search.toLowerCase()) !== -1
                    || this.filterStatus(search.toLowerCase(), data.isAnual);
            });
        }
    }

    private filterStatus(search: string, isAnual: boolean): boolean {
        if (isAnual === false) {
            return 'anual'.indexOf(search) !== -1;
        }
        if (isAnual === true) {
            return 'mensal'.indexOf(search) !== -1;
        }
        return false;
    }

    public searchStatus(isAnual: boolean, requirement: Requirement[]): Requirement[] {
        // tslint:disable-next-line:triple-equals
        return requirement.filter(f => f.isAnual == isAnual);
    }
    public searchInDates(startDate: Date, endDate: Date, requirement: Requirement[]) {
        return requirement.filter(f => new Date(f.date) > startDate && new Date(f.date) < endDate);
    }

}
