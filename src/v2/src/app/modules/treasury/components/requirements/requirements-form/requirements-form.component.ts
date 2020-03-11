import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RequirementStore } from '../requirements.store';
import { Subscription, Observable } from 'rxjs';
import { auth } from '../../../../../auth/auth';
import { Requirement } from '../../../models/requirement';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tap, skipWhile, switchMap, delay } from 'rxjs/operators';
import { RequirementDataComponent } from '../requirements-data/requirements-data.component';
import { RequirementsService } from '../requirements.service';
import { RequirementEditInterface } from '../../../interfaces/requirement/requirement-edit-interface';
import { RequirementUpdateInterface } from '../../../interfaces/requirement/requirement-update-interface';
import { RequirementNewInterface } from '../../../interfaces/requirement/requirement-new-interface';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-requirements-form',
  templateUrl: './requirements-form.component.html',
  styleUrls: ['./requirements-form.component.scss']
})
@AutoUnsubscribe()
export class RequirementFormComponent implements OnInit, OnDestroy {

  formRequirement: FormGroup;
  routeSubscription: Subscription;
  requirement: RequirementEditInterface;
  values: any;
  loading = true;
  isSending = false;

  constructor(
    private formBuilder: FormBuilder,
    public store: RequirementStore,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private requirementDataComponent: RequirementDataComponent,
    private requirementsService: RequirementsService
  ) { }

  ngOnInit() {
    this.initForm();
    this.routeSubscription = this.route.params
      .pipe(
        tap(({ id }) => this.loading = !!id),
        skipWhile(({ id }) => !id),
        switchMap(({ id }) => this.editRequirement(id)),
        delay(500)
      ).subscribe(() => this.loading = false);
    this.requirementDataComponent.openSidenav();
  }

  ngOnDestroy(): void {
    this.requirementDataComponent.closeSidenav();
  }

  private checkIsEdit(): boolean {
    return this.requirement !== undefined && this.requirement !== null;
  }

  public labelTitle(): string {
    return this.checkIsEdit() ? 'Editar Requisito' : 'Novo Requisito';
  }

  initForm(): void {
    this.formRequirement = this.formBuilder.group({
      position: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern(/^[^ ]+( [^ ]+)*$/)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(800), Validators.pattern(/^[^ ]+( [^ ]+)*$/)]],
      score: ['', [Validators.required]],
      date: ['', [Validators.required]],
      evaluationTypeId: ['', [Validators.required]]
    });
  }

  public saveRequirement(): void {
    if (this.formRequirement.valid) {
      this.isSending = true;
      this.sendData()
        .pipe(
          switchMap(() => this.requirementDataComponent.getData()),
          tap(() => this.requirementDataComponent.search()),
          tap(() => this.requirementDataComponent.closeSidenav(),
          () => this.snackBar.open('Ocorreu um erro ao salvar o requisito', 'OK', { duration: 3000 })),
          tap(() => this.snackBar.open('Requisito salvo com sucesso!', 'OK', { duration: 3000 })),
          tap(() => this.isSending = false)
        ).subscribe();
    }
  }

  private sendData() {
    return this.checkIsEdit() ?
        this.sendDataEdit() :
        this.sendDataNew();
  }

  private sendDataNew(): Observable<boolean> {
    console.log(this.getDataNew());
    return this.requirementsService.postRequirement(this.getDataNew());
  }

  private sendDataEdit(): Observable<boolean> {
    const { id } = this.requirement;
    return this.requirementsService.putRequirement(id, this.getDataEdit());
  }

  private getDataNew(): RequirementNewInterface {
    const _requirement = this.formRequirement.value;
    const { id } = auth.getCurrentUnit();
    _requirement.unitId = id;
    return _requirement as RequirementNewInterface;
  }

  private getDataEdit(): RequirementUpdateInterface {
    const _requirement = this.formRequirement.value;
    return {
      position: _requirement.position,
      name: _requirement.name,
      description: _requirement.description,
      score: _requirement.score,
      evaluationTypeId: _requirement.evaluationTypeId,
      date: _requirement.date,
    };
  }

  private editRequirement(id: number) {
    return this.requirementsService.getRequirementEdit(id)
    .pipe(
      tap((data: Requirement) => {
        this.requirement = data;
        this.setValueRequirementEdit();
      })
    );
  }

  private setValueRequirementEdit() {
    if (this.requirement.hasAvaliation) { this.disable(); }
    this.formRequirement.setValue({
      position: this.requirement.position,
      name: this.requirement.name,
      description: this.requirement.description,
      score: this.requirement.score,
      evaluationTypeId: this.requirement.evaluationTypeId,
      date: this.requirement.date,
    });
  }

  private disable() {
    this.formRequirement.controls['name'].disable();
    this.formRequirement.controls['score'].disable();
    this.formRequirement.controls['evaluationTypeId'].disable();
    this.formRequirement.controls['date'].disable();
  }
}
