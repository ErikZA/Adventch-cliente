
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { RequirementStore } from '../requirements.store';
import { AuthService } from '../../../../../shared/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { auth } from '../../../../../auth/auth';
import { Requirement } from '../../../models/requirement';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { TreasuryService } from '../../../treasury.service';

@Component({
  selector: 'app-requirements-form',
  templateUrl: './requirements-form.component.html',
  styleUrls: ['./requirements-form.component.scss']
})
export class RequirementFormComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  formRequirement: FormGroup;
  routeSubscription: Subscription;
  subscribeUnit: Subscription;
  requirement: Requirement;
  params: any;
  values: any;

  constructor(
    private sidenavService: SidenavService,
    private formBuilder: FormBuilder,
    public store: RequirementStore,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private service: TreasuryService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.initForm();
    const unit = this.authService.getCurrentUnit();
    // this.service.getUsers(unit.id).subscribe((data) => {
    //   this.users = data;
    // });

    this.routeSubscription = this.route.params.subscribe((data) => {
      if (data.id) {
        this.editRequirements(this.store.requirements);
      }
    });

    this.subscribeUnit = auth.currentUnit.subscribe(() => {
      this.close();
    });
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  private checkIsEdit(): boolean {
    return this.requirement !== undefined && this.requirement !== null;
  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar' : 'Novo';
  }

  initForm(): void {
    this.formRequirement = this.formBuilder.group({
      position:  ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/^[^ ]+( [^ ]+)*$/)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/^[^ ]+( [^ ]+)*$/)]],
      score:  ['', [Validators.required]],
      date: ['', [Validators.required]],
      isAnual: ['', [Validators.required]]
    });
  }

  closeSidenav() {
    // this.treasureService.setDistrict(new Districts());
    this.sidenavService.close();
  }

  saveRequirement() {
    if (!this.formRequirement.valid) {
      return;
    }
    this.routeSubscription = this.route.params.subscribe(params => {
      this.params = params['id'];
    });
    const unit = auth.getCurrentUnit();
    this.params ?
    this.values = {
      id: Number(this.params),
      name: this.formRequirement.value.name,
      position: Number(this.formRequirement.value.position),
      score: Number(this.formRequirement.value.score),
      date: this.formRequirement.value.date,
      description: this.formRequirement.value.description,
      isAnual: this.formRequirement.value.isAnual,
      hasAvaliation: this.requirement.hasAvaliation,
      unitId: unit.id }
      :
      this.values = {
        name: this.formRequirement.value.name,
        position: Number(this.formRequirement.value.position),
        score: Number(this.formRequirement.value.score),
        date: this.formRequirement.value.date,
        description: this.formRequirement.value.description,
        isAnual: this.formRequirement.value.isAnual,
        hasAvaliation: this.requirement.hasAvaliation,
        unitId: unit.id };

    if (this.formRequirement.valid) {
      this.service.saveRequirements(this.values).subscribe((data) => {
        this.store.addRequirement(this.values);
        this.snackBar.open('Requisito salvo com sucesso!', 'OK', { duration: 5000 });
        this.formRequirement.markAsUntouched();
        this.close();
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar requisito, tente novamente.', 'OK', { duration: 5000 });
      });
    } else {
      return;
    }
  }

  editRequirements(requirement) {
    this.requirement = requirement;
    this.formRequirement.setValue({
      position: requirement.position.toString(),
      name: requirement.name,
      description: requirement.description,
      score: requirement.score.toString(),
      isAnual: requirement.isAnual.toString(),
      date: requirement.date,
    });

    if (this.requirement.hasAvaliation) {
      this.disable();
    }
  }

  private disable() {
    this.formRequirement.controls['name'].disable();
    this.formRequirement.controls['score'].disable();
    this.formRequirement.controls['isAnual'].disable();
    this.formRequirement.controls['date'].disable();
  }

  close() {
    this.store.openRequirement(new Requirement());
    this.sidenavService.close();
    this.router.navigate([this.router.url.replace('/novo', '').replace('requisitos/' + this.values.id + '/editar', 'requisitos')]);
    this.resetAllForms();
  }

  resetAllForms() {
    this.formRequirement.reset();
  }
}
