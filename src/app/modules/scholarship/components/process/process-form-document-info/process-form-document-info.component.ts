import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-process-form-document-info',
  templateUrl: './process-form-document-info.component.html',
  styleUrls: ['./process-form-document-info.component.scss']
})
export class ProcessFormDocumentInfoComponent implements OnInit {
  @Input() type: number;
  infos  = [
    {
      type: 1,
      info: [`Cópia do RG e CPF ou CNH de todas as pessoas do grupo familiar, inclusive para menores de 18 anos de idade,
      podendo para estes ser a Certidão de Nascimento`,
      `Comprovação da situação Cadastral no Cadastro Único/CadUnico - NIS`,
      `Guarda e Tutela: O aluno que esteja sob a guarda legal de pessoa, diferente de seus pais,
      deverá apresentar Termo de Guarda Judicial`,
      'Para o solicitante (responsável) estrangeiro - Cópia do Registro Nacional de Estrangeiros (RNE)',
      'Para o beneficiário (candidato/aluno) estrangeiro – Comprovação da concessão da naturalidade brasileira']
    },
    {
      type: 2,
      info: [`Todas as páginas e o recibo de entrega da última declaração do Imposto de Renda Pessoa Física (IRPF),
      de todos os membros do grupo familiar a partir de 18 anos ou emancipados`,
      `Para o não declarante de IRPF apresentar a impressão da página WEB do sistema da Receita Federal -
      “CONSULTA DE RESTITUIÇÃO”. https://servicos.receita.fazenda.gov.br/Servicos/ConsRest/Atual.app/paginas/index.asp.
      Consultar o site da Receita Federal, informar CPF, data de nascimento e digitar o código de verificação do site,
      e imprimir a página seguinte`,
      `Para sócios ou proprietários de empresas e microempresas, que componham o grupo familiar, apresentar todas as páginas
      e o recibo de entrega do SPED Fiscal, DEFIS, DASN SIMEI, ou, em caso de empresa inativa a Declaração de Inatividade Jurídica
      ou baixa definitiva do CNPJ da respectiva`],
    },
    {
      type: 3,
      info: [`Cópia da CTPS de todos os integrantes do grupo familiar a partir de 18 anos ou emancipados,
      mesmo os que estiverem dentro das seguintes condições: desempregados, estagiários, funcionários públicos,
       estudantes, estatuatário/celetista, militáres, aposentados, autônomos, proficionais liberais e proprietários/sócios
        de empresa. Páginas: nº de série (pag da foto), Qualificação Civil (Pag verso da foto), Contrato de Trabalho
        (penúltima e última pags com registro de trabalho e a próxima página em branco imediatamente subsequentes a estas).`,
       `Caso tenha duas CTPS, tirar cópia da antiga e da atual das mesmas páginas acima citadas`,
       `No caso de não possuir CTPS, apresentar declaração informando que não possui, com firma reconhecida em cartório`],
    },
    {
      type: 4,
      info: [`ASSALARIADOS: Contracheque dos ÚLTIMOS TRÊS MESES TRABALHADOS independentemente se for trabalhador da área pública
      ou privada ou funcionário desta Instituição`,
      `TRABALHADOR AUTONOMO OU PROFISSIONAL LIBERAL: Deverá apresentar declaração de rendimento de próprio punho, em que deverá
      constar valor, ocupação profissional e ser reconhecida em cartório. (Declaração original)`,
      `PROPRIETARIO OU SÓCIO DE EMPRESA:  Para o proprietário ou sócio de empresa, apresentar DECORE referente a “Pró-Labore” e
      Distribuição de Lucros (Decore original). NÃO ACEITAREMOS O PRO LABORE EM SUBSTITUIÇÃO AO DECORE`,
      `ESTAGIARIO: Contrato de estágio, (termo aditivo se houver) e declaração de rendimentos do órgão competente, desde que conste
      a vigência e o valor da remuneração`,
      `PENSÃO ALIMENTÍCIA, JUDICIALMENTE OU NÃO: Em caso do candidato ou pais separados, judicialmente ou não, apresentar o comprovante
      atualizado de recebimento da pensão alimentícia ou declaração de ajuda financeira constando o valor mensal recebido nos últimos
      3 (três) meses. Caso não haja nenhum tipo de ajuda, também deverá ser apresentada declaração de tal fato, com firma reconhecida em
      cartório. (Declaração original)`,
      `PENSIONISTAS OU BENEFICIÁRIOS DO INSS: Em caso de candidato ou pais aposentados ou viúvos pensionistas, apresentar o comprovante
      do recebimento de proventos emitido pelo INSS (detalhamento de rendimentos previdenciários) referente ao último mês ou extrato do
      benefício atualizado.  (Acessar site www.previdenciasocial.gov.br , caso não consiga acesso online, deverá procurar o INSS)`,
      `PREVIDÊNCIA PRIVADA: As pessoas do grupo familiar que recebem Previdência Privada também deverão apresentar o comprovante atualizado
      desse benefício`,
      `RECEITAS DE ALUGUEIS, ARRENDAMENTO DE IMÓVEIS E BENS MOVEIS, AJUDA FINANCEIRA REGULAR DE PESSOA QUE NÃO FAÇA PARTE DO GRUPO
      FAMILIAR: Cópia de contratos e comprovante atual do recebimento ou declaração reconhecida em cartório`,
      `BENEFICIÁRIO DE PROGRAMA SOCIAL: Bolsa Família e/ou Benefício de Prestação Continuada – BPC (apresentar cartão e comprovante
        atualizado de recebimento do INSS)`,
      `DESEMPREGADO(A): Comprovante do seguro desemprego com o valor do vencimento e número de parcelas`,
      `DESEMPREGADO(A) OU “DO LAR”:  - Para o desempregado que não está recebendo auxílio desemprego, declaração do próprio punho,
      mencionando que está desempregado ou que seja “do lar” e não exerce atividade remunerada por opção própria, informando suas fontes
      para subsistência. (Declaração original)`],
    },
    {
      type: 5,
      info: [`ALUGUEL DE IMÓVEL RESIDENCIAL: Contrato de locação vigente com firma reconhecida e comprovante/recibo de pagamento do último
      mês, ou Declaração do Proprietário do imóvel com firma reconhecida, com dados do Locador, do Proprietário, Endereço e valor aluguel`,
      `FINANCIAMENTO DE IMÓVEL: Comprovante de pagamento da última prestação. Caso seja débito em conta, apresentar extrato bancário onde
      conste o nome do financiado e o valor da parcela atualizado`,
      `DESPESAS COM SAUDE: Apresentar o laudo médico atual, com CID, em se tratando de doença crônica de acordo com a Portaria do Ministério
      da Saúde nº 2998/2001`,
      `DESPESAS COM EDUCAÇÃO: Comprovante de pagamento da última mensalidade. (Escola ou faculdade)`,
      `DESPESAS ÁGUA, LUZ, TELEFONE FIXO E CELULAR (de todos os membros da família), INTERNET, TV A CABO E CONDOMINIO: Apresentar
      comprovante do último mês, para comprovação também de residência. Caso seja agua de poço ou outro tipo, especificar`,
      `FINANCIAMENTO DE VEÍCULO: Comprovante de pagamento da última prestação`],
    },
    {
      type: 6,
      info: [`Boletim do último bimestre cursado (para alunos veteranos)`,
      `Cópia do histórico escolar (somente para alunos novatos)`,
      `Parecer Descritivo (para alunos de anos iniciais)`]
    }
  ];
  selectedInfo: string[] = [];
  showInfo = false;
  constructor() { }

  ngOnInit() {
    const selected = this.infos.filter(i => i.type === this.type);
    this.selectedInfo = Array.isArray(selected[0].info) ? selected[0].info : [];
  }

}
