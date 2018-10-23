import { tap, switchMap, skipWhile, delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ProcessDataComponent } from './../process-data/process-data.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material';
import { ScholarshipService } from '../../../scholarship.service';

import { Student } from '../../../models/student';
import { Responsible } from '../../../models/responsible';
import { StudentSerie } from '../../../models/studentSerie';

import { CustomValidators } from '../../../../../core/custom-validators';
import { auth } from '../../../../../auth/auth';
import { ProcessDocument } from '../../../models/processDocument';
import { School } from '../../../models/school';
import { NewProcessViewModel, EditProcessViewModel } from '../../../interfaces/process-view-models';

import { ReportService } from '../../../../../shared/report.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-process-form',
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.scss']
})
@AutoUnsubscribe()
export class ProcessFormComponent implements OnInit, OnDestroy {
  formProcess: FormGroup;
  responsible: Responsible;
  isSending = false;
  // New
  process: EditProcessViewModel;
  loading = true;
  processId: number;

  students: Student[] = [];
  studentSeries: StudentSerie[] = [];
  processDocuments: ProcessDocument[] = [];
  processDocumentsForm: FormGroup;
  // 1	Documentos Pessoais
  // 2	Imposto de Renda
  // 3	Carteira de Trabalho
  // 4	Comprovantes de Rendimentos
  // 5	Comprovantes de Despesas
  // 6	Rendimento Acadêmico
  types = [
    { id: 1, description: 'Documentos Pessoais', controlName: 'doc1', },
    { id: 2, description: 'Imposto de Renda', controlName: 'doc2', },
    { id: 3, description: 'Carteira de Trabalho', controlName: 'doc3' },
    { id: 4, description: 'Comprovantes de Rendimentos', controlName: 'doc4' },
    { id: 5, description: 'Comprovantes de Despesas', controlName: 'doc5' },
    { id: 6, description: 'Rendimento Acadêmico', controlName: 'doc6' },
  ];
  selectStudent: Student;
  subsCheckCpf: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private scholarshipService: ScholarshipService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private processDataComponent: ProcessDataComponent,
    private reportService: ReportService
  ) { }


  ngOnInit() {
    this.initForm();
    this.checkCpf();
    this.scholarshipService.getStudentSeries()
      .pipe(
        tap(series => {
          this.studentSeries = series;
        }),
        switchMap(() => this.scholarshipService.getAllDocuments()),
        tap(documents => this.processDocuments = documents),
        switchMap(() => this.route.params),
        tap(({ id }) => this.loading = !!id),
        skipWhile(({ id }) => {
          this.setSchoolSelectedToNewProcess();
          if (this.scholarshipService.schoolSelected <= 0 && !id) {
            this.processDataComponent.closeSidenav();
            this.snackBar.open('Selecione uma escola na dashboard para criar um novo processo', 'OK', { duration: 5000 });
            return true;
          }
          return !id;
        }),
        switchMap(({ id }) => this.scholarshipService.getProcessById(id)),
        tap(process => this.process = process),
        tap(process => this.setValuesToFormProcess(process)),
        tap(process => this.setValuesToFormDocuments(process.documents)),
        delay(500)
      ).subscribe(() => this.loading = false);
    this.processDataComponent.openSidenav();
  }

  ngOnDestroy() {
    this.processDataComponent.closeSidenav();
  }

  private setSchoolSelectedToNewProcess(): void {
    const { idSchool } = auth.getCurrentUser();
    this.scholarshipService.schoolSelected = idSchool === 0 ? this.scholarshipService.schoolSelected : idSchool;
  }

  private createFormGroupForTypes(types: any[]): FormGroup {
    const obj = {};
    types.forEach(t => {
      obj[t.controlName] = [[], Validators.required];
    });
    return this.formBuilder.group(obj);
  }

  private initForm(): void {
    this.processDocumentsForm = this.createFormGroupForTypes(this.types);
    this.formProcess = this.formBuilder.group({
      cpf: [null, [Validators.required, CustomValidators.cpfCnpjValidator]],
      name: [null, Validators.required],
      email: [null],
      phone: [null],
      rc: [null],
      nameStudent: [null, Validators.required],
      studentSerieId: [null, Validators.required],
      bagPorcentage: [null, Validators.required]
    });
  }
  private checkCpf(): void {
    const responsibleCpfForm = this.formProcess.get('cpf');
    this.subsCheckCpf = responsibleCpfForm
    .valueChanges
    .subscribe((cpf: string) => {
      if (responsibleCpfForm.valid) {
        this.scholarshipService
        .getResponsible(cpf)
        .subscribe(responsible => {
          if (!responsible) {
            return;
          }
          this.students = Array.isArray(responsible.students) ? responsible.students : [];
          this.setFormValuesResponsible(responsible);
          this.responsible = responsible;
        });
      } else {
        this.resetInformationsResponsible();
      }
    });
  }
  private resetInformationsResponsible() {
    this.students = [];
    this.responsible = null;
    this.resetFormResponsibleAndStudent();
  }

  private resetFormResponsibleAndStudent() {
    this.formProcess.patchValue({
      name: null,
      email: null,
      phone: null,
      rc: null,
      nameStudent: null,
      studentSerieId: null,
      bagPorcentage: null
    });
  }

  private setFormValuesResponsible(values: Responsible): void {
    this.formProcess.patchValue({
      name: values.name,
      email: values.email,
      phone: values.phone
    });
  }
  private setValuesToFormProcess(process: EditProcessViewModel): void {
    this.selectStudent = process.student ? {
      id: process.student.id,
      name: process.student.name,
      rc: process.student.rc,
      responsible: process.responsible,
      school: new School(),
      studentSerie: new StudentSerie()
    } : null;

    this.responsible = process.responsible ? {
      cpf: process.responsible.cpf,
      id: process.responsible.id,
      email: process.responsible.email,
      phone: process.responsible.phone,
      name: process.responsible.name
    } : null;
    this.formProcess.patchValue({
      cpf: process.responsible.cpf,
      name: process.responsible.name,
      email: process.responsible.email,
      phone: process.responsible.phone,
      rc: process.student.rc,
      nameStudent: process.student.name,
      studentSerieId: process.serieId,
      bagPorcentage: process.bagPorcentage.toString()
    });
  }
  private setValuesToFormDocuments(documents: number[]) {
    documents.forEach(d => {
      const doc = this.processDocuments.find(pd => pd.id === d);
      const type = this.types.find(t => t.id === doc.type);
      const control = this.processDocumentsForm.get(type.controlName);
      control.setValue([
        ...control.value,
        d
      ]);
    });
  }
  private getAllDocumentsFromTypes(): number[] {
    const formControls = this.types.map(t => t.controlName);
    let result = [];
    formControls.forEach(c => {
      const value = this.processDocumentsForm.get(c).value;
      const ar = Array.isArray(value) ? value : [];
      result = [
        ...result,
        ...ar
      ];
    });
    return result;
  }
  private mapFormToViewModel(): NewProcessViewModel {
    const user = auth.getCurrentUser();
    if (!Number.isInteger(user.idSchool) || !Number.isInteger(user.id)) {
      throw new Error('user id and use school id is invalid');
    }
    if (
      user.idSchool === 0 &&
      (!Number.isInteger(this.scholarshipService.schoolSelected) || this.scholarshipService.schoolSelected <= 0) &&
      typeof this.process === 'undefined'
    ) {
      throw new Error('school selected is invalid');
    }
    return {
      responsible: {
        cpf: this.formProcess.value.cpf,
        email: this.formProcess.value.email,
        id: !!this.responsible ? Number.isInteger(this.responsible.id) ? this.responsible.id : 0 : 0,
        name: this.formProcess.value.name,
        phone: this.formProcess.value.phone
      },
      bagPorcentage: this.formProcess.value.bagPorcentage,
      schoolId: user.idSchool === 0 ? this.scholarshipService.schoolSelected : user.idSchool,
      userId: user.id,
      serieId: this.formProcess.value.studentSerieId,
      documents: this.getAllDocumentsFromTypes(),
      student: {
        id: !!this.selectStudent ? Number.isInteger(this.selectStudent.id) ? this.selectStudent.id : 0 : 0,
        rc: this.formProcess.value.rc,
        name: this.formProcess.value.nameStudent,
      }
    };
  }
  private markAstouched() {
    this.types.forEach(t => {
      this.processDocumentsForm.get(t.controlName).markAsTouched();
    });
    this.formProcess.markAsTouched();
  }
  private handleSaveSuccess(id: number) {
    this.generateReport(id);
    this.snackBar.open('Processo salvo com sucesso', ' OK', { duration: 2000 });
    this.processDataComponent.closeSidenav();
  }

  public generateReport(id: number) {
    this.reportService
    .reportProcess(id)
    .subscribe(dataURL => {
      const fileUrl = URL.createObjectURL(dataURL);
      const element = document.createElement('a');
      element.href = fileUrl;
      element.download = 'processo.pdf';
      element.target = '_blank';
      element.click();
      this.snackBar.open('Relatório gerado com sucesso.', 'OK', { duration: 5000 });
    }, err => {
        console.log(err);
        this.snackBar.open('Erro ao gerar relatório, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  public getDocumentsByType(type: number): ProcessDocument[] {
    return this.processDocuments.filter(d => d.type === type);
  }
  public filter(val: string): Student[] {
    if (!Array.isArray(this.students)) {
      return [];
    }
    return this.students.filter(student => {
      return student.name.toLowerCase().indexOf(val) !== -1;
    });
  }
  public labelTitleProcess(): string {
    return this.process !== undefined && this.process !== undefined ? 'Editar Processo' : 'Novo Processo';
  }
  public setStudent(student: Student): void {
    if (Number.isInteger(student.rc)) {
      this.formProcess.patchValue({ rc: student.rc });
    }
    this.selectStudent = student;
  }
  public saveProcess(): void {
    if (!this.processDocumentsForm.valid || !this.formProcess.valid) {
      this.markAstouched();
      return;
    }
    const data = this.mapFormToViewModel();
    this.isSending = true;
    if (typeof this.process === 'undefined') {
      this.scholarshipService.saveProcess(data)
        .pipe(
          tap(id => this.handleSaveSuccess(id)),
          switchMap(() => this.processDataComponent.getProcesses())
        ).subscribe(() => this.isSending = false);
    } else {
      this.scholarshipService.editProcess(this.process.id, data)
        .pipe(
          tap(() => this.handleSaveSuccess(this.process.id)),
          switchMap(() => this.processDataComponent.getProcesses())
        ).subscribe(() => this.isSending = false);
    }
  }
  public maskPhone(phone): string {
    return phone.value.length <= 14 ? '(99) 9999-9999' : '(99) 99999-9999';
  }
}
