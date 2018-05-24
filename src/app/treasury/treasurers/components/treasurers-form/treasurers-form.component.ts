import { Component, OnInit, EventEmitter, OnDestroy, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, FormArray } from '@angular/forms';
import { AuthService } from '../../../../shared/auth.service';
import { Church } from '../../../models/church';
import { TreasuryService } from '../../../treasury.service';
import { Subscription } from 'rxjs';
import { Treasurer } from '../../../models/treasurer';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { TreasurersComponent } from '../../treasurers.component';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-treasurers-form',
  templateUrl: './treasurers-form.component.html',
  styleUrls: ['./treasurers-form.component.scss']
})

export class TreasurersFormComponent implements OnInit, OnDestroy {
  @Input() currentUnit: any;

  [x: string]: any;
  formTreasurer: FormGroup;
  formPersonal: FormGroup;
  formPhones: FormArray;
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
    public treasureComponent: TreasurersComponent,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    moment.locale('pt');
    this.currentUnit = this.authService.getCurrentUnit();
    this.treasurer.gender = 1;
    this.initForm();
    this.getChurches();
    this.subscribe2 = this.activatedRoute.params.subscribe((data) => {
      this.treasurer.gender = this.treasureComponent.treasurer.gender;
      this.editTreasurer(this.treasureComponent.treasurer);
    });
    this.dates = {
      now: new Date(new Date().setFullYear(new Date().getFullYear())),
      min: new Date(new Date().setFullYear(new Date().getFullYear() - 95)),
      max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    };
  }

  ngDoCheck() {
    if (this.authService.getCurrentUnit().id !== this.currentUnit.id) {
      this.cd.detectChanges();
      this.currentUnit = this.authService.getCurrentUnit();
      this.getChurches();
      this.formTreasurer.reset();
    }
  }

  ngOnDestroy() {
    if (this.subscribe1) { this.subscribe1.unsubscribe(); }
    if (this.subscribe2) { this.subscribe2.unsubscribe(); }
  }



  editTreasurer(treasurer) {
    if (treasurer.id === undefined) {
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
        dateBirth: treasurer.dateBirth,
        genderId: treasurer.gender
    });

    this.formContact.setValue({
      email: treasurer.email,
      phones: [treasurer.phone],
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
      dateBirth: [null],
      genderId: [null]
    });
    this.formPhones = this.formBuilder.array([this.returnPhone()]);
    this.formContact = this.formBuilder.group({
      email: [null],
      contact: [null],
      address: [null],
      addressComplement: [null],
      cep: [null],
      phones: this.formPhones,
    });
    this.formTreasurer = this.formBuilder.group({
      personal: this.formPersonal,
      contact: this.formContact,
    });
  }

  returnPhone() {
    return this.formBuilder.group({
      number: [null],
      type: [null],
      isWhatsapp: [null],
      isTelegram: [null]
    });
  }

  addPhone() {
    const lastPhone = this.formPhones.value[this.formPhones.length - 1].number;
    if(lastPhone !== null || lastPhone !== "")
      this.formPhones.push(this.returnPhone());
  }

  removeAddress(i: number) {
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
    this.treasurer = new Treasurer();
    this.treasureComponent.sidenavRight.close();
    this.router.navigate(['tesouraria/tesoureiros']);
  }

  saveTreasurer() {
    const treasurer = {
      ...this.formPersonal.value,
      ...this.formContact.value,
      unitId: this.authService.getCurrentUnit().id,
      id: this.treasureComponent.treasurer.id,
      identity: this.treasureComponent.treasurer.identity
    };
    if (this.formTreasurer.valid) {
      debugger
      this.treasuryService.saveTreasurer(treasurer).subscribe(() => {
        this.treasureComponent.getData();
        this.snackBar.open('Tesoureiro salvo!', 'OK', { duration: 5000 });
        this.formTreasurer.markAsUntouched();
        this.formTreasurer.reset();
        this.close();
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar tesoureiro, tente novamente.', 'OK', { duration: 5000 });
        this.close();
      });
    } else {
      return;
    }
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
}
