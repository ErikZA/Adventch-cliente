import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
import { MatSnackBar, MatSidenav, MatDialogRef, MatDialog } from '@angular/material';
import { ScholarshipComponent } from '../scholarship.component';
import { ProcessDataComponent } from '../process-data/process-data.component';
import { ProcessDocument } from '../../models/processDocument';
import { ReportNewProcessComponent } from '../reports/report-new-process/report-new-process.component';
import { CustomValidators } from '../../../core/custom-validators';

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
  formSave: boolean = false;
  dialogRef: MatDialogRef<ReportNewProcessComponent>;
  informations = false;

  personal: any = {
    value: 1,
    formName: 'isPersonalDocuments',
    formOptionsName: 'personalOptions',
    label: 'Documentos Pessoais',
    moreAbout: false,
    more: ['Cópia da certidão de nascimento ou cédula de identidade de todas as pessoas do grupo familiar menores de 18 anos de idade', 'Cópias do CPF e RG de todas as pessoas do grupo familiar a partir de 18 anos de idade', 'Para Estrangeiros: Cópia do Registro Nacional de Estrangeiros (RNE)', 'Cópia da Certidão de Casamento dos Pais e outros membros do grupo familiar que sejam casados', 'Em caso de União Estável, apresentar declaração a próprio punho ou digitada reconhecida em cartório', 'Cópia da certidão de óbito do cônjuge, caso alguém do grupo familiar seja viúvo (a)', 'Caso os pais do candidato ou membro do grupo familiar sejam separados ou divorciados, apresentar cópia da Certidão de casamento com a averbação'],
    options:  ['Certidão de Nascimento ou cédula de identidade', 'CPF e RG', 'Registro Nacional de Estrangeiros (RNE)', 'Certidão de Casamento', 'Declaração de União Estável', 'Certidão de óbito do cônjuge', 'Certidão de casamento com a averbação', 'Termo de guarda judicial ou protocolo de ingresso do pedido']
  };
  ir: any = {
    value: 2,
    formName: 'isIR',
    formOptionsName: 'irOptions',
    label: 'Imposto de Renda',
    moreAbout: false,
    more: ['Todas as páginas completas e o Recibo de Entrega da última declaração do Imposto de Renda de Pessoa Física (IRPF). Obrigatório para todos os membros do grupo familiar a partir de 18 anos ou emancipados', 'Para quem não declara Imposto de Renda de Pessoa Física, consultar o site da Receita Federal, informar CPF, data de nascimento e digitar o código de verificação do site, e imprimir a página seguinte. Não necessita reconhecer em cartório.', 'Para sPara sócios ou proprietários de empresas e microempresas (MEI) que componham o grupo familiar, apresentar recibo de entrega e todas as páginas completas da Declaração de Imposto de Renda de Pessoa Jurídica (IRPJ), Simples Nacional, MEI, ou em caso de empresa inativa entregar o documento de baixa da empresa ou declaração de inatividade informadas pela receita federal'],
    options:  ['Recibo e Declaração do Imposto de Renda de Pessoa Física (IRPF)', 'Declaração de IRPF', 'Declaração de Imposto de Renda de Pessoa Jurídica (IRPJ)', 'Simples Nacional', 'MEI', 'Documento de baixa da empresa', 'Declaração de inatividade informadas pela receita federal']
  };
  ctps: any = {
    value: 3,
    formName: 'isCTPS',
    formOptionsName: 'ctpsOptions',
    label: 'Carteira de Trabalho',
    moreAbout: false,
    more: ['Cópia da CTPS de todos os integrantes do grupo familiar a partir de 18 anos ou emancipados, mesmo os que estiverem dentro das seguintes condições: desempregados, estagiários, funcionários públicos, estudantes, estatuatário/celetista, militáres, aposentados, autônomos, proficionais liberais e proprietários/sócios de empresa. Páginas: nº de série (pag da foto), Qualificação Civil (Pag verso da foto), Contrato de Trabalho (penúltima e última pags com registro de trabalho e a próxima página em branco imediatamente subsequentes a estas).','Caso tenha duas CTPS, tirar cópia da antiga e da atual das mesmas páginas acima citadas', 'No caso de não possuir CTPS, apresentar declaração informando que não possui, com firma reconhecida em cartório'],
    options:  ['Carteira de trabalho de todos os integrantes da familia', 'Possui duas carteiras de trabalho', 'Declaração de que não possui certeira de trabalho']
  };
  income: any = {
    value: 4,
    formName: 'isIncome',
    formOptionsName: 'incomeOptions',
    label: 'Comprovantes de Rendimentos',
    moreAbout: false,
    more: ['ASSALARIADO: No caso de não possuir CTPS, apresentar declaração informando que não possui, com firma reconhecida em cartório', 'AUTONOMO:	Declaração de rendimentos digitada ou a próprio punho, onde deverá constar o valor real bruto recebido, ocupação profissional e ser reconhecida em cartório', 'PROPRIETARIO OU SÓCIO DE EMPRESA: DECORE ref. ao Pró-labore e aos Lucros Distribuídos recebidos pela empresa.', 'DESEMPREGADO OU DO LAR: Declaração digitada ou a próprio punho reconhecida em cartório mencionando que está desempregado ou que não exerce atividade remunerada por opção própria, informando suas fontes para subsistência (documento original)', 'ESTAGIÁRIO:	Contrato de estágio, (termo aditivo se houver) e declaração de rendimentos do órgão competente, desde que conste a vigência e o valor da remuneração', 'PAIS SEPARADOS, JUDICIALMENTE OU NÃO:	Apresentar o comprovante atualizado de recebimento de pensão alimentícia ou declaração de ajuda financeira constando o valor recebido. Caso não haja nenhum tipo de ajuda, também deverá ser apresentada declaração de tal fato. Ambas as declarações devem ser reconhecidas em cartório', 'APOSENTADOS, VIÚVOS PENSIONISTAS, AUXILIO DOENÇA OU QUALQUER TIPO DE AUXILIO RECEBIDO PELA PREVIDÊNCIA SOCIAL: Apresentar o comprovante de recebimento de proventos emitido pelo INSS (detalhamento de rendimentos previdenciários), ou extrato do benefício retirado no site do DATAPREV, juntamente com o comprovante bancário referente ao último mês recebido (se não conseguir acesso online, deverá procurar o INSS)', 'BENEFICIÁRIO DE PROGRAMA SOCIAL: Bolsa Família e/ou Benefício de Prestação Continuada (BCP), apresentar cópia do cartão e comprovante de recebimento', 'PESSOAS QUE RECEBEM PREVIDÊNCIA PRIVADA: Apresentar o comprovante atualizado do benefício', 'RECEITAS DE ALUGUEIS, ARRENDAMENTO DE IMÓVEIS E BENS MOVEIS, AJUDA FINANCEIRA REGULAR DE PESSOA QUE NÃO FAÇA PARTE DO GRUPO FAMILIAR: Cópia de contratos e comprovante atual do recebimento ou declaração reconhecida em cartório'],
    options:  ['Contracheques/Holerites', 'Declaração da firma empregadora dos últimos três meses trabalhados na sequência', 'Declaração de rendimentos digitada ou a próprio punho', 'DECORE ref. ao Pró-labore e aos Lucros Distribuídos recebidos pela empresa.', 'Declaração digitada ou a próprio punho reconhecida em cartório mencionando que está desempregado', 'Contrato de estágio', 'Comprovante atualizado de recebimento de pensão alimentícia ou declaração de ajuda financeira', 'Comprovante de recebimento de proventos emitido pelo INSS', 'Extrato do benefício retirado no site do DATAPREV e comprovante bancário dos ultimos três meses', 'Cartão e comprovante de recebimento de Bolsa Fámilia e ou Benefício de Prestação Continuada (BCP)', 'Comprovante atualizado da previdência privada', 'Contratos e comprovante atual do recebimento ou declaração reconhecida em cartório de alugueis, arrendamentos e ou ajuda financeira']
  };
  expenses: any = {
    value: 5,
    formName: 'isExpenses',
    formOptionsName: 'expensesOptions',
    label: 'Comprovantes de Despesas',
    moreAbout: false,
    more: ['ALUGUEL DE IMÓVEL RESIDENCIAL: Contrato de locação vigente com firma reconhecida e comprovante de pagamento do último mês (recibo) e Declaração do Proprietário do imóvel com firma reconhecida, com dados do Locador, do Proprietário, Endereço e valor aluguel', 'FINANCIAMENTO DE IMÓVEL: Cópia da última prestação paga do imóvel, se for descontado em folha fazer declaração reconhecida em cartório', 'MORADIA/CASA CEDIDA: Declaração do Proprietário do imóvel com firma reconhecida, com dados do MORADOR, do Proprietário e Endereço', 'DESPESAS COM SAUDE: •	Laudo médico e/ou parecer com CID (código da doença) e CRM (código registro médico), receituário médico e as notas fiscais utilizadas. Não entra valor de plano de saúde.', 'DESPESAS COM EDUCAÇÃO: Ultimo comprovante mensal com a entidade educacional (Escola e/ou Faculdade)', 'DESPESAS AGUA, LUZ E TELEFONE FIXO: Cópia do ultimo comprovante de energia (caso seja compartilhada com outras residencias no mesmo terreno, fazer declaração), água (se a água estiver inclusa no condomínio, apresentar comprovante e especificar) e telefone fixo (conta de celular e internet não entram no cálculo da solicitação de gratuidade) e no caso de não usar água da Sanepar, fazer declaração especificando se é de poço', 'DESPESAS COM TRANSPORTE ESCOLAR: Comprovante de pagamento mensal ou contrato de transporte escolar', 'FINANCIAMENTO DE VEÍCULO: Cópia da última prestação paga do veículo, se for descontado em folha fazer declaração reconhecida em cartório'],
    options:  ['Contrato de locação de aluguel de imóvel', 'Declaração do Proprietário do imóvel alugado com firma reconhecida', 'Última prestação paga do financiamento do imóvel', 'Declaração do Proprietário do imóvel cedido com firma reconhecida', 'Laudo médico e/ou parecer com CID e CRM, receituário médico e as notas fiscais utilizadas para despesas com saúde', 'Ultimo comprovante mensal com a entidade educacional (Escola e/ou Faculdade)', 'Ultimo comprovante de energia e água', 'Ultimo comprovante de Telefone Fixo', 'Declaração de não utilização de água encanada', 'Comprovante de pagamento mensal ou contrato de transporte escolar', 'Cópia da última prestação paga do veículo']
  };
  academic: any = {
    value: 6,
    formName: 'isAcademic',
    formOptionsName: 'academicOptions',
    label: 'Rendimento Acadêmico',
    moreAbout: false,
    more: ['Boletim do último bimestre cursado (para alunos veteranos)', 'Cópia do histórico escolar (somente para alunos novatos)'],
    options:  ['Boletim do último bimestre cursado', 'Histórico escolar']
  };
  checkBoxList: any = [this.personal, this.ir, this.ctps, this.income, this.expenses, this.academic];

  constructor(
    private formBuilder: FormBuilder,
    private scholarshipService: ScholarshipService,
    private sidenavService: SidenavService,
    private router: Router,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initForm();
    this.formProcess.get('cpf').valueChanges.subscribe(cpf => {
      if(cpf == null || cpf == undefined)
        return;
      this.responsible = new Responsible();
      if (!this.formProcess.get('cpf').hasError('pattern')) {
        let idSchool = this.scholarshipService.schoolSelected;
        if(idSchool == '-1' && this.scholarshipService.processEdit != undefined)
          idSchool = this.scholarshipService.processEdit.student.school.id.toString();
        this.scholarshipService.getResponsible(Number(idSchool), cpf).subscribe(responsible => {
          this.responsible = Object.assign(this.responsible, responsible as Responsible);
          this.setpatchValuesResponsible();
          if (responsible) {
            this.scholarshipService.getChildrenStudents(responsible.id).subscribe((data: Student[]) =>{
              this.studentsChildren = Object.assign(this.studentsChildren, data as Student[]);
              this.filterStudentsChildren$ = Observable.of(this.studentsChildren);
            })
          }
        });
      } else {
        this.setpatchValuesResponsible();
      }
    });
    this.editProcess();
  }

  ngOnDestroy(){
    this.closeSidenav();
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
      cpf: [null, [Validators.required, CustomValidators.cpfCnpjValidator]],
      name: [null, Validators.required],
      email: [null],
      phone: [null],
      nameStudent: [null, Validators.required],
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
    })
  }

  labelTitleProcess() {
    return this.scholarshipService.processEdit != undefined && this.scholarshipService.processEdit.id != undefined ? 'Editar' : 'Novo';
  }

  editProcess(){
    let process = this.scholarshipService.processEdit;
    if(process != undefined && process.id != undefined){
      this.formProcess = new FormGroup({
        cpf: new FormControl({value: process.student.responsible.cpf, disabled: true}, Validators.required),
        name: new FormControl({value: process.student.responsible.name, disabled: false}, Validators.required),
        email: new FormControl({value: process.student.responsible.email, disabled: false}),
        phone: new FormControl({value: process.student.responsible.phone, disabled: false}),
        nameStudent: new FormControl({value: process.student.name, disabled: false}, Validators.required),
      });
      this.formCheckDocuments = new FormGroup({
        isPersonalDocuments: new FormControl({value: 'true', disabled: true}, Validators.required),
        personalOptions: new FormControl(),
        isIR: new FormControl({value: 'true', disabled: true}, Validators.required),
        irOptions: new FormControl(),
        isCTPS: new FormControl({value: 'true', disabled: true}, Validators.required),
        ctpsOptions: new FormControl(),
        isIncome: new FormControl({value: 'true', disabled: true}, Validators.required),
        incomeOptions: new FormControl(),
        isExpenses: new FormControl({value: 'true', disabled: true}, Validators.required),
        expensesOptions: new FormControl(),
        isAcademic: new FormControl({value: 'true', disabled: true}, Validators.required),
        academicOptions: new FormControl()
      });
      this.setDocumentsSelectes(process.processDocuments);
    }
  }

  setDocumentsSelectes(documents){
    let docs1 = documents.filter(doc => { return doc.typeDocument == 1 });
    this.formCheckDocuments.controls['personalOptions'].setValue(docs1.map(s => s.name));
    let docs2 = documents.filter(doc => { return doc.typeDocument == 2 });
    this.formCheckDocuments.controls['irOptions'].setValue(docs2.map(s => s.name));
    let docs3 = documents.filter(doc => { return doc.typeDocument == 3 });
    this.formCheckDocuments.controls['ctpsOptions'].setValue(docs3.map(s => s.name));
    let docs4 = documents.filter(doc => { return doc.typeDocument == 4 });
    this.formCheckDocuments.controls['incomeOptions'].setValue(docs4.map(s => s.name));
    let docs5 = documents.filter(doc => { return doc.typeDocument == 5 });
    this.formCheckDocuments.controls['academicOptions'].setValue(docs5.map(s => s.name));
    let docs6 = documents.filter(doc => { return doc.typeDocument == 6 });
    this.formCheckDocuments.controls['academicOptions'].setValue(docs6.map(s => s.name));
  }

  closeSidenav() {
    this.scholarshipService.processEdit = new Process();
    this.sidenavService.close();
    this.router.navigate([this.router.url.replace("/novo", "").replace("/editar", "")]);
  }

  saveProcess() {
    let isEdit = this.scholarshipService.processEdit != undefined && this.scholarshipService.processEdit.id != undefined;
    this.formSave = true;
    let idScholSelected = this.scholarshipService.schoolSelected;
    if(idScholSelected == '-1' || isEdit)
      idScholSelected = this.scholarshipService.processEdit.student.school.id.toString();
    let studentSelected = this.studentsChildren.filter(item => { return item.name == this.formProcess.value.nameStudent });
    if(isEdit)
      this.responsible = this.scholarshipService.processEdit.student.responsible;
    if (this.formProcess.valid && this.formCheckDocuments.valid) {
      let data = {
        responsibleId: this.responsible === undefined || this.responsible.id == undefined ? 0 : this.responsible.id,
        studentId: studentSelected == undefined || studentSelected.length == 0 ? 0 : studentSelected[0].id,
        schoolId: Number(idScholSelected),
        status: 1,
        id: isEdit ? this.scholarshipService.processEdit.id : 0,
        userId: this.authService.getCurrentUser().identifier,
        rc: studentSelected == undefined || studentSelected.length == 0 ? 0 : studentSelected[0].rc,
        ...this.formProcess.value,
        ...this.formCheckDocuments.value,
      };

      this.scholarshipService.postProcess(data).subscribe(x =>{
        this.closeSidenav();
        this.formProcess.reset();
        this.formCheckDocuments.reset();
        this.scholarshipService.refresh.next(true);
        this.generateReport(x.obj);
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao salvar o processo, tente novamente.', 'OK', { duration: 5000 });
      });
    }
  }

  generateReport(id){
    this.scholarshipService.getProcessById(id).subscribe(process => {
      let processReport = new Process();
      processReport = Object.assign(processReport, process as Process);
      this.scholarshipService.setReport(processReport);
      this.dialogRef = this.dialog.open(ReportNewProcessComponent, {
        width: '70%',
        height: '70%'
      });
      this.dialogRef.afterClosed().subscribe(result => {
        this.snackBar.open('Processo salvo com sucesso!', 'OK', { duration: 5000 });
        if (!result)
          return;
      });
    });
  }

  maskPhone(phone) {
    return phone.value.length <= 14 ? '(99) 9999-9999' : '(99)9 9999-9999';
  }
}
