import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';



import { TreasuryService } from '../../treasury.service';
import { AuthService } from '../../../../shared/auth.service';
import { Observable ,  BehaviorSubject } from 'rxjs';
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
            data = data.sort((obj1, obj2) => {
                if (obj1.position > obj2.position) {
                    return 1;
                }
                if (obj1.position < obj2.position) {
                    return -1;
                }
                return 0;
            });
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
            this.dataStore.requirements.sort((obj1, obj2) => {
                if (obj1.position > obj2.position) {
                    return 1;
                }
                if (obj1.position < obj2.position) {
                    return -1;
                }
                return 0;
            });
        }
        this.requirements = new Requirement();
    }

    public save(obj) {
        this.service.saveRequirements(obj).subscribe((data) => {
            setTimeout(() => {
                this.snackBar.open('Requisito salvo com sucesso!', 'OK', { duration: 5000 });
                this.loadAll();
              }, 1000);
        }, err => {
            console.log(err);
            this.snackBar.open('Erro ao salvar requisito, tente novamente.', 'OK', { duration: 5000 });
        });
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
                    || this.filterStatus(search.toLowerCase(), data.evaluationTypeId);
            });
        }
    }

    private filterStatus(search: string, evaluationTypeId: number): boolean {
        if (evaluationTypeId === 1) {
            return 'anual'.indexOf(search) !== -1;
        }
        if (evaluationTypeId === 3) {
            return 'semanal'.indexOf(search) !== -1;
        }
        if (evaluationTypeId === 0) {
          return 'mensal'.indexOf(search) !== -1;
        }
        return false;
    }

    public searchStatus(evaluationTypeId: number, requirement: Requirement[]): Requirement[] {
        // tslint:disable-next-line:triple-equals
        return requirement.filter(f => f.evaluationTypeId == evaluationTypeId);
    }

    public searchInPeriod(year: number, requirement: Requirement[]) {
        return requirement.filter(f => new Date(f.date).getFullYear() === year);
    }

}
