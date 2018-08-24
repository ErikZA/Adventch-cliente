import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';


import { MatSnackBar } from '@angular/material';

import { SidenavService } from '../../../../../core/services/sidenav.service';
import { ScholarshipService } from '../../../scholarship.service';
import { ReportService } from '../../../../../shared/report.service';

import { Student } from '../../../models/student';
import { Process } from '../../../models/process';
import { Responsible } from '../../../models/responsible';
import { StudentSerie } from '../../../models/studentSerie';

import { CustomValidators } from '../../../../../core/custom-validators';
import { auth } from '../../../../../auth/auth';
import { ProcessDocument } from '../../../models/processDocument';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { School } from '../../../models/school';
import { NewProcessViewModel, EditProcessViewModel } from '../../../interfaces/process-view-models';

@Component({
  selector: 'app-process-form',
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.scss']
})
export class ProcessFormComponent implements OnInit, OnDestroy {
  formProcess: FormGroup;
  // formCheckDocuments: FormGroup;
  responsible: Responsible;
  // student: Student = new Student();
  // studentsChildren: Student[] = new Array<Student>();
  filterStudentsChildren$: Observable<Student[]>;
  // formSave = false;
  // informations = false;
  isSending = false;
  // New
  process: Process;
  loading: boolean;
  studentsSeries$: Observable<StudentSerie[]>;

  subscribeUnit: Subscription;

  students: Student[] = [];
  studentSeries: StudentSerie[] = [];
  processDocuments: ProcessDocument[] = [];
  processDocumentsForm: FormGroup;

  types = [
    { id: 1, description: 'Documentos Pessoais', controlName: 'doc1', },
    { id: 2, description: 'Imposto de Renda', controlName: 'doc2', },
    { id: 3, description: 'Carteira de Trabalho', controlName: 'doc3' },
    { id: 4, description: 'Comprovantes de Rendimentos', controlName: 'doc4' },
    { id: 5, description: 'Comprovantes de Despesas', controlName: 'doc5' },
    { id: 6, description: 'Rendimento Acadêmico', controlName: 'doc6' },
  ];
  documentTypes = new BehaviorSubject([]);
  selectStudent: Student;
  processId: number;
  constructor(
    private formBuilder: FormBuilder,
    private scholarshipService: ScholarshipService,
    private sidenavService: SidenavService,
    private route: ActivatedRoute,
    // private router: Router,s
    // private authService: AuthService,
    public snackBar: MatSnackBar,
    private reportService: ReportService,
    // private store: ProcessesStore,
    private location: Location,
  ) { }

  ngOnInit() {
    this.loading = false;
    this.initForm();
    this.checkCpf();
// 1	Documentos Pessoais
// 2	Imposto de Renda
// 3	Carteira de Trabalho
// 4	Comprovantes de Rendimentos
// 5	Comprovantes de Despesas
// 6	Rendimento Acadêmico
    this.scholarshipService.getStudentSeries().subscribe(series => {
      this.studentSeries = series;
    });
    this.scholarshipService.getAllDocuments().subscribe(documents => {
      this.processDocuments = documents;
      this.documentTypes.next(this.types);
    });
    const obj = {};

    this.types.forEach(t => {
      obj[t.controlName] = [[], Validators.required];
    });

    this.processDocumentsForm = this.formBuilder.group(obj);
    this.route.params.subscribe(({ identifyProcess }) => {
      console.log('route params', identifyProcess);
      const parsed = parseInt(identifyProcess, 10);
      if (Number.isInteger(parsed)) {
        this.scholarshipService.getProcessById(identifyProcess).subscribe((process: EditProcessViewModel) => {
          console.log(process);
          this.setValuesToFormProcess(process);
          this.setValuesToFormDocuments(process.documents);
          this.processId = parsed;
        });
      }
    });
  }
  private checkCpf(): void {
    const responsibleCpfForm = this.formProcess.get('cpf');
    responsibleCpfForm.valueChanges.subscribe((cpf: string) => {
      if (responsibleCpfForm.valid) {
        this.scholarshipService.getResponsible(cpf).subscribe(responsible => {
          this.students = Array.isArray(responsible.students) ? responsible.students : [];
          this.setFormValuesResponsible(responsible);
          this.responsible = responsible;
        });
      }
    });
  }
  public getDocumentsByType(type: number): ProcessDocument[] {
    return this.processDocuments.filter(d => d.type === type);
  }
  ngOnDestroy() {
    this.closeSidenav();
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }
  public filter(val: string): Student[] {
    if (!Array.isArray(this.students)) {
      return [];
    }
    return this.students.filter(student => {
      return student.name.toLowerCase().indexOf(val) !== -1;
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
      bagPorcentage: process.bagPorcentage
    });
  }
  private setValuesToFormDocuments(documents: number[]) {
    documents.forEach(d => {
      const doc = this.processDocuments.find(pd => pd.id === d);

      console.log('DOC ===>', doc);
      const type = this.types.find(t => t.id === doc.type);
      const control = this.processDocumentsForm.get(type.controlName);
      control.setValue([
        ...control.value,
        d
      ]);
    });
  }
  private initForm(): void {
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

  public labelTitleProcess(): string {
    return this.process !== undefined && this.process.id !== undefined ? 'Editar' : 'Novo';
  }

  public setStudent(student: Student): void {
    if (Number.isInteger(student.rc)) {
      this.formProcess.patchValue({ rc: student.rc });
    }
    this.selectStudent = student;
  }

  public closeSidenav(): void {
    this.sidenavService.close();
  }
  private markAstouched() {
    this.types.forEach(t => {
      this.processDocumentsForm.get(t.controlName).markAsTouched();
    });

    this.formProcess.markAsTouched();
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
      throw new Error('user id and use schol id is invalid');
    }
    return {
      responsible: {
        cpf: this.formProcess.value.cpf,
        email: this.formProcess.value.email,
        id: this.responsible.id,
        name: this.formProcess.value.name,
        phone: this.formProcess.value.phone
      },
      bagPorcentage: this.formProcess.value.bagPorcentage,
      schoolId: user.idSchool,
      userId: user.id,
      serieId: this.formProcess.value.studentSerieId,
      documents: this.getAllDocumentsFromTypes(),
      student: {
        id: Number.isInteger(this.selectStudent.id) ? this.selectStudent.id : null,
        rc: this.formProcess.value.rc,
        name: this.formProcess.value.nameStudent,
      }
    };
  }

  public saveProcess(): void {
    if (!this.processDocumentsForm.valid || !this.formProcess.valid) {
      this.markAstouched();
      return;
    }
    const data = this.mapFormToViewModel();
    console.log(data);

    if (Number.isInteger(this.processId)) {
      console.log('edit', this.processId);
      this.scholarshipService.editProcess(this.processId, data).subscribe(res => {
        this.handleSaveSuccess();
      });
      return;
    }
    this.scholarshipService.saveProcess(data).subscribe(res => {
      this.handleSaveSuccess();
    });
  }
  private handleSaveSuccess() {
    this.snackBar.open('Processo salvo com sucesso', ' OK', { duration: 2000 });
    this.closeSidenav();
  }
  public maskPhone(phone): string {
    return phone.value.length <= 14 ? '(99) 9999-9999' : '(99) 99999-9999';
  }
}
