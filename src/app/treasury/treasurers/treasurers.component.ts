import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { State } from '../../core/components/progress-spinner/models/state';
import { Table } from '../../core/components/data-table/models/table';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SidenavService } from '../../core/services/sidenav.service';
import { Subscription } from 'rxjs';
import { TreasuryService } from '../treasury.service';
import { Treasurer } from '../models/treasurer';
import { Unit } from '../../shared/models/unit.model';
import { Church } from '../models/church';
import { MatSidenav } from '@angular/material';
import { TreasurersFormComponent } from './components/treasurers-form/treasurers-form.component';
import { EFunction } from '../models/Enums';

@Component({
  selector: 'app-treasurer',
  templateUrl: './treasurers.component.html',
  styleUrls: ['./treasurers.component.scss']
})
export class TreasurersComponent implements OnInit {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  subscribe1: Subscription;
  treasurers: Treasurer[] = new Array<Treasurer>();
  treasurer: Treasurer = new Treasurer();
  form: FormGroup;
  table: Table = {
    data: ELEMENT_DATA,
    columns: [{
      header: 'position',
      label: 'No.',
      // size: Size.Small
    }, {
      header: 'name',
      label: 'Name',
      // size: Size.Large
    }, {
      header: 'weight',
      label: 'Weight',
      // size: '30%'
    }, {
      header: 'symbol',
      label: 'Symbol',
      // size: '20%'
    }],
    options: {
      buttonNew: true,
      // select: false
    }
  };
  state: State = {
    isLoadingResults: false,
    isRateLimitReached: false,
    // messageRateLimitReached: "GitHub's API rate limit has been reached. It will be reset in one minute."
  };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sidenavService: SidenavService,
    public TrasureService: TreasuryService
  ) { }

  ngOnInit() {
    this.table.options.buttonNew = false;
    this.getData();
  }

  getData(){
    this.subscribe1 = this.TrasureService.getTreasurers().subscribe((data: Treasurer[]) =>{
      this.treasurers = Object.assign(this.treasurers, data as Treasurer[]);
    });
    //return this.http
    //  .get('values/getTreasurers')
      //.map((res: String) => {
      //  const data = res.json() as String;

      //  data.forEach((o: TreasurerModel) => {
      //    o.items.forEach(i => i.parentObj = o);
      //  });

       // return data;
      //})
    //  .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createTreasurer(): void {
    this.router.navigate(['/new']);
  }

  editTreasurer(treasurer): void{
    this.treasurer = treasurer;
    this.router.navigate([treasurer.id + '/edit'], { relativeTo: this.route });
    this.sidenavRight.open();
  }

  removeTreasurers(treasurers) {
    console.log(treasurers);
  }

  openSidenav() {
    this.sidenavRight.open();
  }
}

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  id: string;
}

const ELEMENT_DATA: Treasurer[] = [
  {
    id: 'A65XaCfH',
    church: new Church(), 
    unit: new Unit(),
    function: EFunction.AssistantTreasurer,
    dateRegister: new Date(),
    dateBirth: new Date(),
    gender: 1,
    name: 'teste 123',
    contact: 'teste',
    address: 'teste',
    addressComplement: 'teste',
    cep: '123213',
    phone: '123',
    email: 'teste@teste.com',
    cpf: '12312312323',
  },
  {
    id: 'FjGulpJa',
    church: new Church(), 
    unit: new Unit(),
    function: EFunction.AssistantTreasurer,
    dateRegister: new Date(),
    dateBirth: new Date(),
    gender: 1,
    name: 'teste 321',
    contact: 'teste',
    address: 'teste',
    addressComplement: 'teste',
    cep: '123213',
    phone: '123',
    email: 'teste@teste.com',
    cpf: '12312312323'
  },
  {
    id: '6RxhJ6RF',
    church: new Church(), 
    unit: new Unit(),
    function: EFunction.AssistantTreasurer,
    dateRegister: new Date(),
    dateBirth: new Date(),
    gender: 1,
    name: 'teste 213',
    contact: 'teste',
    address: 'teste',
    addressComplement: 'teste',
    cep: '123213',
    phone: '123',
    email: 'teste@teste.com',
    cpf: '12312312323'
  }
];

ELEMENT_DATA[0].church.id = '08jmxGpV';
ELEMENT_DATA[1].church.id = '2721ENm8';
ELEMENT_DATA[2].church.id = '33qBspAF';

ELEMENT_DATA[0].unit.id = 2;
ELEMENT_DATA[1].unit.id = 2;
ELEMENT_DATA[2].unit.id = 2;