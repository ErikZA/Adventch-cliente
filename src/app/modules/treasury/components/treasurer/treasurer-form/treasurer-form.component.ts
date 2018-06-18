
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { MatSnackBar } from '@angular/material';

import { AuthService } from '../../../../../shared/auth.service';
import { TreasuryService } from '../../../treasury.service';
import { TreasurerStore } from '../treasurer.store';

import { Phone } from './../../../models/phone';
import { Church } from '../../../models/church';
import { Treasurer } from '../../../models/treasurer';

import * as moment from 'moment';


import { TreasurerDataComponent } from '../treasurer-data/treasurer-data.component';
import { SidenavService } from '../../../../../core/services/sidenav.service';

@Component({
  selector: 'app-treasurer-form',
  templateUrl: './treasurer-form.component.html',
  styleUrls: ['./treasurer-form.component.scss']
})

export class TreasurerFormComponent implements OnInit, OnDestroy {
  [x: string]: any;
  formTreasurer: FormGroup;
  formPersonal: FormGroup;
  formPhones: FormArray;
  formContact: FormGroup;
  lstChurches: Church[] = new Array<Church>();
  subscribeUnit: Subscription;
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
    private store: TreasurerStore,
    private treasurerDataComponent: TreasurerDataComponent,
    private sidenavService: SidenavService,
  ) { }

  ngOnInit() {
    this.initConfigurations();
    this.initForm();
    this.getChurches();
    this.subscribeUnit = this.authService.currentUnit.subscribe(() => {
      this.updateUnit();
    });
    this.subscribe2 = this.activatedRoute.params.subscribe((data) => {
      this.editTreasurer(this.store.treasurer);
    });
  }

  initConfigurations() {
    this.dates = {
      now: new Date(new Date().setFullYear(new Date().getFullYear())),
      min: new Date(new Date().setFullYear(new Date().getFullYear() - 95)),
      max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    };
    moment.locale('pt');
    this.treasurer.gender = 1;
  }

  updateUnit() {
      this.getChurches();
      this.formTreasurer.reset();
  }

  ngOnDestroy() {
    if (this.subscribe1) { this.subscribe1.unsubscribe(); }
    if (this.subscribe2) { this.subscribe2.unsubscribe(); }
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  editTreasurer(treasurer: Treasurer) {
    if (treasurer.id === undefined) {
      this.resetAllForms();
      return;
    }
    this.treasurer.gender = this.store.treasurer.gender;
    this.formPersonal.setValue({
        name: treasurer.name,
        churchId: treasurer.church.id,
        functionId: treasurer.function,
        dateRegister: treasurer.dateRegister,
        cpf: treasurer.cpf,
        dateBirth: treasurer.dateBirth,
        genderId: treasurer.gender
    });

    this.setPhonesValue(treasurer);
    this.formContact.setValue({
       email: treasurer.email,
       contact: treasurer.contact,
       address: treasurer.address,
       addressComplement: treasurer.addressComplement,
       cep: treasurer.cep
    });
  }

  setPhonesValue(treasurer) {
    for (let i = 0; i < treasurer.phones.length; i++) {
      const phone: Phone = treasurer.phones[i];
      if (i !== 0) {
        this.addPhone();
      }
      this.formPhones.controls[i].setValue({
        id: phone.id,
        number: phone.number,
        type: phone.type,
        isWhatsapp: phone.isWhatsapp,
        isTelegram: phone.isTelegram
      });
    }
  }

  initForm(): void {
    this.formPhones = this.formBuilder.array([this.returnPhone()]);
    this.formPersonal = this.formBuilder.group({
      name: [null, Validators.required],
      churchId: [null, Validators.required],
      functionId: [null, Validators.required],
      dateRegister: [null],
      cpf: [null],
      dateBirth: [null],
      genderId: [null]
    });
    this.formContact = this.formBuilder.group({
      email: [null],
      contact: [null],
      address: [null],
      addressComplement: [null],
      cep: [null],
    });
    this.formTreasurer = this.formBuilder.group({
      personal: this.formPersonal,
      contact: this.formContact,
    });
  }

  returnPhone() {
    return this.formBuilder.group({
      id: 0,
      number: [null],
      type: [null],
      isWhatsapp: [null],
      isTelegram: [null]
    });
  }

  addPhone() {
    const lastPhone = this.formPhones.value[this.formPhones.length - 1];
    if (lastPhone.number !== null && lastPhone.number !== '') {
      this.formPhones.push(this.returnPhone());
    }
  }

  removePhone(i: number) {
    const control = <FormArray>this.formPhones;
    control.removeAt(i);
  }

  getChurches() {
    const unit = this.authService.getCurrentUnit();
    this.lstChurches = [];
    this.subscribe1 = this.treasuryService.getChurches(unit.id).subscribe((data: Church[]) => {
      this.lstChurches = Object.assign(this.lstChurches, data as Church[]);
    });
  }

  close() {
    this.store.editTreasurer(new Treasurer());
    this.sidenavService.close();
    this.router.navigate([this.router.url.replace('/novo', '').replace('/editar', '')]);
    this.resetAllForms();
  }

  saveTreasurer() {
    const treasurer = {
      ...this.formPersonal.value,
      ...this.formContact.value,
      phones: this.formPhones.value[0].number == null ? [] : this.formPhones.value,
      unitId: this.authService.getCurrentUnit().id,
      id: this.store.treasurer.id,
      identity: this.store.treasurer.identity
    };
    if (this.formTreasurer.valid) {
      this.treasuryService.saveTreasurer(treasurer).subscribe((data) => {
        this.store.updateTreasurers(data.obj);
        this.snackBar.open('Tesoureiro salvo!', 'OK', { duration: 5000 });
        this.formTreasurer.markAsUntouched();
        this.resetAllForms();
        this.close();
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar tesoureiro, tente novamente.', 'OK', { duration: 5000 });
      });
    } else {
      return;
    }
  }

  resetAllForms() {
    this.formPersonal.reset();
    this.formContact.reset();
    this.formPhones.reset();
  }

  getSelectDateTime() {
    const date = this.formPersonal.get('dateRegister').value;
    if (this.dateRegisterValid()) {
      return moment(date).fromNow();
    }
  }

  dateRegisterValid() {
    if (this.formPersonal.get('dateRegister').value != null && this.formPersonal.get('dateRegister').value !== undefined) {
      return true;
    }
    return false;
  }

  maskPhone(phone) {
    return phone.value.length <= 14 ? '(99) 9999-9999' : '(99) 99999-9999';
  }
}
