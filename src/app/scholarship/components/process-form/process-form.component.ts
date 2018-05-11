import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { ScholarshipService } from '../../scholarship.service';
import { Responsible } from '../../models/responsible';
import { Student } from './../../models/student';
import { startWith } from 'rxjs/operators';
import { map } from 'rxjs/operator/map';
import { SidenavService } from '../../../core/services/sidenav.service';
import { Router } from '@angular/router';
import { Process } from '../../models/process';
import { AuthService } from '../../../shared/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-process-form',
  templateUrl: './process-form.component.html',
  styleUrls: ['./process-form.component.scss']
})
export class ProcessFormComponent implements OnInit {

  formProcess: FormGroup;
  formCheckDocuments: FormGroup;
  responsible: Responsible;
  student: Student;
  studentsChildren: Student[];
  filterStudentsChildren$: Observable<Student[]>;
  formSave: boolean = false;

  personal: any = {
    value: 1,
    formName: 'isPersonalDocuments',
    formOptionsName: 'personalOptions',
    label: 'Documentos Pessoais',
    options:  ['Certidão de Nascimento ou cédula de identidade', 'CPF e RG', 'Registro Nacional de Estrangeiros (RNE)', 'Certidão de Casamento', 'União Estável', 'Certidão de óbito do cônjuge', 'Certidão de casamento com a averbação', 'Termo de guarda judicial ou protocolo de ingresso do pedido']
  };
  ir: any = {
    value: 2,
    formName: 'isIR',
    formOptionsName: 'irOptions',
    label: 'Imposto de Renda',
    options:  ['Recibo e Declaração do Imposto de Renda de Pessoa Física (IRPF)', 'Não Precisa de Declaração de imposto de Renda', 'Declaração de Imposto de Renda de Pessoa Jurídica (IRPJ)', 'Simples Nacional', 'MEI', 'Documento de baixa da empresa', 'Declaração de inatividade informadas pela receita federal']
  };
  ctps: any = {
    value: 3,
    formName: 'isCTPS',
    formOptionsName: 'ctpsOptions',
    label: 'Carteira de Trabalho',
    options:  ['Carteira de trabalho de todos os integrantes da familia', 'Possui duas carteiras de trabalho', 'Declaração de que não possui certeira de trabalho']
  };
  income: any = {
    value: 4,
    formName: 'isIncome',
    formOptionsName: 'incomeOptions',
    label: 'Comprovantes de Rendimentos',
    options:  ['Contracheques/Holerites', 'Declaração da firma empregadora dos últimos três meses trabalhados na sequência', 'Declaração de rendimentos digitada ou a próprio punho', 'DECORE ref. ao Pró-labore e aos Lucros Distribuídos recebidos pela empresa.', 'Declaração digitada ou a próprio punho reconhecida em cartório mencionando que está desempregado', 'Contrato de estágio', 'Comprovante atualizado de recebimento de pensão alimentícia ou declaração de ajuda financeira', 'Comprovante de recebimento de proventos emitido pelo INSS', 'Extrato do benefício retirado no site do DATAPREV e comprovante bancário dos ultimos três meses', 'Cartão e comprovante de recebimento de Bolsa Fámilia e ou Benefício de Prestação Continuada (BCP)', 'Comprovante atualizado da previdência privada', 'Contratos e comprovante atual do recebimento ou declaração reconhecida em cartório de alugueis, arrendamentos e ou ajuda financeira']
  };
  expenses: any = {
    value: 5,
    formName: 'isExpenses',
    formOptionsName: 'expensesOptions',
    label: 'Comprovantes de Rendimentos',
    options:  ['Contrato de locação de aluguel de imóvel', 'Declaração do Proprietário do imóvel alugado com firma reconhecida', 'Última prestação paga do financiamento do imóvel', 'Declaração do Proprietário do imóvel cedido com firma reconhecida', 'Laudo médico e/ou parecer com CID (código da doença) e CRM (código registro médico), receituário médico e as notas fiscais utilizadas para despesas com saúde', 'Ultimo comprovante mensal com a entidade educacional (Escola e/ou Faculdade)', 'Ultimo comprovante de energia e água', 'Ultimo comprovante de Telefone Fixo', 'Declaração de não utilização de água encanada', 'Comprovante de pagamento mensal ou contrato de transporte escolar', 'Cópia da última prestação paga do veículo']
  };
  academic: any = {
    value: 6,
    formName: 'isAcademic',
    formOptionsName: 'academicOptions',
    label: 'Rendimento Acadêmico',
    options:  ['Boletim do último bimestre cursado', 'Histórico escolar']
  };
  checkBoxList: any = [this.personal, this.ir, this.ctps, this.income, this.expenses, this.academic];



  constructor(
    private formBuilder: FormBuilder,
    private scholarshipService: ScholarshipService,
    private sidenavService: SidenavService,
    private router: Router,
    private authService: AuthService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initForm();
    this.formProcess.get('cpf').valueChanges.subscribe(cpf => {
      this.responsible = new Responsible();
      this.student = new Student();
      if (!this.formProcess.get('cpf').hasError('pattern')) {
        this.scholarshipService.getResponsible(Number(this.scholarshipService.schoolSelected), cpf).subscribe(responsible => {
          this.responsible = Object.assign(this.responsible, responsible as Responsible);
          this.setpatchValuesResponsible();
          if (responsible) {
            this.filterStudentsChildren$ = this.scholarshipService.getChildrenStudents(responsible.id);
          }
        });
      } else {
        this.studentsChildren = new Array<Student>();
        this.filterStudentsChildren$ = Observable.of(this.studentsChildren);
        this.setpatchValuesResponsible();
      }
    });
  }

  filter(val: string): Student[] {
    if (this.studentsChildren) {
      return [];
    }

    return this.studentsChildren.filter(student => {
          return student.name.toLowerCase().indexOf(val) !== -1;
      });
  }

  setpatchValuesResponsible() {
    this.formProcess.patchValue({
      name: this.responsible.name,
      email: this.responsible.email,
      phone: this.responsible.phone
    });
  }

  initForm() {
    this.formProcess = this.formBuilder.group({
      cpf: [null, Validators.required],
      name: [null, Validators.required],
      email: [null],
      phone: [null],
      nameStudent: [null, Validators.required],
    });
    this.formCheckDocuments = this.formBuilder.group({
      isPersonalDocuments: [null, Validators.required],
      personalOptions: [null],
      isIR: [null, Validators.required],
      irOptions: [null],
      isCTPS: [null, Validators.required],
      ctpsOptions: [null],
      isIncome: [null, Validators.required],
      incomeOptions: [null],
      isExpenses: [null, Validators.required],
      expensesOptions: [null],
      isAcademic: [null, Validators.required],
      academicOptions: [null],
    })
  }

  closeSidenav() {
    this.sidenavService.close();
    this.router.navigate(['bolsas/processos']);
  }

  saveProcess() {
    this.formSave = true;
    if (this.formProcess.valid && this.formCheckDocuments.errors === null) {
      let data = {
        responsibleId: this.responsible.id === undefined ? 0 : this.responsible.id,
        studentId: this.student.id === undefined ? 0 : this.student.id,
        schoolId: Number(this.scholarshipService.schoolSelected),
        status: 1,
        userId: this.authService.getCurrentUser().id,
        ...this.formProcess.value,
        ...this.formCheckDocuments.value,
      };
      console.log(data);

      this.scholarshipService.postProcess(data).subscribe(x =>{
        this.snackBar.open('Processo salvo com sucesso!', 'OK', { duration: 5000 });
        this.sidenavService.close();
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar o processo, tente novamente.', 'OK', { duration: 5000 });
      });
    }
  }
}
