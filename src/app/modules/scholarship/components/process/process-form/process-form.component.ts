import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';


import { MatSnackBar } from '@angular/material';

import { ProcessesStore } from '../processes.store';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { ScholarshipService } from '../../../scholarship.service';
import { ReportService } from '../../../../../shared/report.service';

import { Student } from '../../../models/student';
import { Process } from '../../../models/process';
import { Responsible } from '../../../models/responsible';
import { AuthService } from '../../../../../shared/auth.service';
import { StudentSerie } from '../../../models/studentSerie';

import { CustomValidators } from '../../../../../core/custom-validators';
import { auth } from '../../../../../auth/auth';
import { ProcessDocument } from '../../../models/processDocument';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-process-form',
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.scss']
})
export class ProcessFormComponent implements OnInit, OnDestroy {
  formProcess: FormGroup;
  formCheckDocuments: FormGroup;
  responsible: Responsible;
  student: Student = new Student();
  studentsChildren: Student[] = new Array<Student>();
  filterStudentsChildren$: Observable<Student[]>;
  formSave = false;
  informations = false;
  isSending = false;

  // checkBoxList: any = [this.personal, this.ir, this.ctps, this.income, this.expenses, this.academic];

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
  constructor(
    private formBuilder: FormBuilder,
    private scholarshipService: ScholarshipService,
    private sidenavService: SidenavService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
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

    // const docsForm = this.types.map(type => ({
    //   [type.formName]: [null, Validators.required]
    // }));
    const obj = {};

    this.types.forEach(t => {
      obj[t.controlName] = [null, Validators.required];
    });

    this.processDocumentsForm = this.formBuilder.group(obj);
    // this.studentsSeries$ = this.store.studentSeries$;
    this.route.params.subscribe(params => {
      // this.store.processes$.pipe(
      //   map((todos: Process[]) => todos != null ? todos
      //     .find((item: Process) => item.identity.toLocaleUpperCase() === params['identifyProcess']) : new Process())
      // ).subscribe(x => {
      //   this.process = x;
      //   if (!params['identifyProcess']) {
      //     this.loading = true;
      //   } else if (this.process) {
      //     this.editProcess();
      //     this.loading = true;
      // }});
      // if (params['identifyProcess']) {
      //   this.store.loadProcessByIdentity(params['identifyProcess']);
      // }
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
  private resetAll() {
    this.closeSidenav();
  }

  ngOnDestroy() {
    this.resetAll();
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  public filter(val: string): Student[] {
    if (this.studentsChildren) {
      return [];
    }
    return this.studentsChildren.filter(student => {
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
    this.formCheckDocuments = this.formBuilder.group({
      isPersonalDocuments: [null, Validators.required],
      personalOptions: [null, Validators.required],
      isIR: [null, Validators.required],
      irOptions: [null, Validators.required],
      isCTPS: [null, Validators.required],
      ctpsOptions: [null, Validators.required],
      isIncome: [null, Validators.required],
      incomeOptions: [null, Validators.required],
      isExpenses: [null, Validators.required],
      expensesOptions: [null, Validators.required],
      isAcademic: [null, Validators.required],
      academicOptions: [null, Validators.required],
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


    console.log(this.formProcess.valid, this.formProcess.value);
    // console.log(this.formCheckDocuments.valid, this.formCheckDocuments.value);
    console.log(this.processDocumentsForm.valid, this.processDocumentsForm.value);
    console.log('DOCUMENTS', this.getAllDocumentsFromTypes());

    if (!this.processDocumentsForm.valid || !this.formProcess.valid) {
      this.markAstouched();
      return;
    }
    const data = this.mapFormToViewModel();
    console.log(data);

    this.scholarshipService.saveProcess(data).subscribe(res => {
      console.log('SUCESS', res);
      this.snackBar.open('Processo salvo com sucesso', ' OK', { duration: 2000 });
      this.closeSidenav();
    });
    // this.isSending = true;
    // this.formSave = true;

    // let idScholSelected = this.scholarshipService.schoolSelected;
    // let status;
    // if (idScholSelected === -1 || this.checkIsEdit()) {
    //   idScholSelected = this.process.student.school.id;
    // }
    // const studentSelected = this.studentsChildren.filter(item => item.name === this.formProcess.value.nameStudent);
    // if (this.checkIsEdit()) {
    //   this.responsible = this.process.student.responsible;
    //   status = this.process.status;
    //   this.formProcess.get('rc').enable();
    // } else {
    //   status = 1;
    // }
    // if (this.formProcess.valid && this.formCheckDocuments.valid) {
    //   const data = this.setProcessValues(studentSelected, idScholSelected, status, this.checkIsEdit());
    //   this.store.saveProcess(data);
    //   setTimeout(() => {
    //     // this.formProcess.reset();
    //     // this.formCheckDocuments.reset();
    //     this.isSending = false;
    //   }, 5000);
    // } else {
    //   this.isSending = false;
    // }
  }

  public checkIsEdit(): boolean {
    const isEdit = this.process !== undefined && this.process.id !== undefined;
    return isEdit;
  }

  public getChecked(): boolean {
    if (this.checkIsEdit()) {
      if (this.process.bagPorcentage === 50) {
        return true;
      }
      return false;
    }
    return true;
  }

  public maskPhone(phone): string {
    return phone.value.length <= 14 ? '(99) 9999-9999' : '(99) 99999-9999';
  }
}
interface NewProcessViewModel {
    bagPorcentage: number;
    serieId: number;
    schoolId: number;
    userId: number;
    responsible: ResponsibleProcessViewModel;
    student: StudentProcessViewModel;
    documents: number[];
}

interface ResponsibleProcessViewModel extends NewResponsibleViewModel {
    id: number;
}

interface NewResponsibleViewModel {
    cpf: string;
    name: string;
    email: string;
    phone: string;
}

interface StudentProcessViewModel extends StudentProcessDataViewModel {
    id: number;
}

interface StudentProcessDataViewModel {
    name: string;
    rc?: number;
}

