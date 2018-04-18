import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-treasurer',
  templateUrl: './treasurers.component.html',
  styleUrls: ['./treasurers.component.scss']
})
export class TreasurersComponent implements OnInit {

  subscribe1: Subscription;
  treasurers: Treasurer[] = new Array<Treasurer>();
  form: FormGroup;
  table: Table = {
    data: [],
    columns: [{
      header: 'Nome',
      label: 'Nome'
    },{
      header: 'Igreja',
      label: 'Igreja'
    },{
      header: 'Distrito',
      label: 'Distrito'
    },{
      header: 'Cidade',
      label: 'Cidade'
    },{
      header: 'Cargo',
      label: 'Cargo'
    },{
      header: 'Endereço',
      label: 'Endereco'
    },{
      header: 'Telefone',
      label: 'Telefone'
    }],
    options: {
      buttonNew: true
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
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  removeTreasurers(treasurers) {
    console.log(treasurers);
  }
}
