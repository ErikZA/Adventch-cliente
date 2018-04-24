import { Component, OnInit, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { AuthService } from '../../../../shared/auth.service';
import { Church } from '../../../models/church';
import { TreasuryService } from '../../../treasury.service';
import { Subscription } from 'rxjs';
import { Treasurer } from '../../../models/treasurer';
import { MatSnackBar } from '@angular/material';
import { TreasurersComponent } from '../../treasurers.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-treasurers-form',
  templateUrl: './treasurers-form.component.html',
  styleUrls: ['./treasurers-form.component.scss']
})

export class TreasurersFormComponent implements OnInit, OnDestroy {
  [x: string]: any;
  formTreasurer: FormGroup;
  formPersonal: FormGroup;
  formContact: FormGroup;
  lstChurches: Church[] = new Array<Church>();
  subscribe1: Subscription;
  subscribe2: Subscription;
  treasurer: Treasurer = new Treasurer();
  dates: any;

  constructor(
    private authService: AuthService,
    private treasuryService: TreasuryService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public treasureComponent: TreasurersComponent) { }

  ngOnInit() {
    this.initForm();
    this.getChurches();
    this.subscribe2 = this.activatedRoute.params.subscribe((data) => {
      this.editTreasurer(this.treasureComponent.treasurer);
    });
  }

  ngOnDestroy() {
    if (this.subscribe1) this.subscribe1.unsubscribe();
    if (this.subscribe2) this.subscribe2.unsubscribe();
    this.editTreasurer(this.treasureComponent.treasurer);
    this.dates = {
      now: new Date(new Date().setFullYear(new Date().getFullYear())),
      min: new Date(new Date().setFullYear(new Date().getFullYear() - 95)),
      max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    }
  }

  editTreasurer(treasurer){
    if(treasurer.id == undefined){
      this.formPersonal.reset();
      this.formContact.reset();
      return;
    }
    this.formPersonal.setValue({
        name: treasurer.name,
        churchId: treasurer.church.id,
        functionId: treasurer.function,
        dateRegister: treasurer.dateRegister,
        cpf: treasurer.cpf,
        phone: treasurer.phone,
        genderId: treasurer.gender
    });

    this.formContact.setValue({
      email: treasurer.email,
      dateBirth: treasurer.dateBirth,
      contact: treasurer.contact,
      address: treasurer.address,
      addressComplement: treasurer.addressComplement,
      cep: treasurer.cep
    });
  }

  initForm(): void {
    this.formPersonal = this.formBuilder.group({
      name: [null, Validators.required],
      churchId: [null, Validators.required],
      functionId: [null, Validators.required],
      dateRegister: [null],
      cpf: [null],
      phone: [null],
      genderId: [null]
    });
    this.formContact = this.formBuilder.group({
      email: [null],
      dateBirth: [null],
      contact: [null],
      address: [null],
      addressComplement: [null],
      cep: [null]
    });
    this.formTreasurer = this.formBuilder.group({
      personal: this.formPersonal,
      contact: this.formContact,
    });
  }

  getChurches(){
    var unit = this.authService.getCurrentUnit();
    this.subscribe1 = this.treasuryService.getChurches(unit.id).subscribe((data: Church[]) =>{
      this.lstChurches = Object.assign(this.lstChurches, data as Church[]);
    });
  }

  close() {
    this.treasurer = new Treasurer();
    //if (this.treasureComponent && this.treasureComponent.sidenavRight.opened){
      this.treasureComponent.sidenavRight.close();
    //}
    this.router.navigate(['treasury/treasurers']);
  }

  saveTreasurer() {
    let treasurer = {
      ...this.formPersonal.value,
      ...this.formContact.value,
      unitId: this.authService.getCurrentUnit().id
    };
    if (this.formTreasurer.valid) {
      this.treasuryService.saveNewTreasurer(treasurer).subscribe(() =>{
        this.snackBar.open('Tesoureiro cadastrado!', 'OK', { duration: 5000 });
        this.formTreasurer.markAsUntouched();
        this.formTreasurer.reset();
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao cadastrar tesoureiro, tente novamente.', 'OK', { duration: 5000 });
      });
    }
    this.close();
  }
}
