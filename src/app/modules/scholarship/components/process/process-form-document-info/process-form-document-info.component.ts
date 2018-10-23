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
      info: ['Cópia da certidão de nascimento ou cédula de identidade de todas as pessoas do grupo familiar menores de 18 anos de idade',
      'Cópias do CPF e RG de todas as pessoas do grupo familiar a partir de 18 anos de idade',
      'Para Estrangeiros: Cópia do Registro Nacional de Estrangeiros (RNE)',
      'Cópia da Certidão de Casamento dos Pais e outros membros do grupo familiar que sejam casados',
      'Em caso de União Estável, apresentar declaração a próprio punho ou digitada reconhecida em cartório',
      'Cópia da certidão de óbito do cônjuge, caso alguém do grupo familiar seja viúvo (a)',
      `Caso os pais do candidato ou membro do grupo familiar sejam separados ou divorciados, apresentar cópia
      da Certidão de casamento com a averbação`]
    },
    {
      type: 2,
      info: [`Todas as páginas completas e o Recibo de Entrega da última declaração do Imposto de Renda de Pessoa Física (IRPF).
      Obrigatório para todos os membros do grupo familiar a partir de 18 anos ou emancipados`,
      `Para quem não declara Imposto de Renda de Pessoa Física, consultar o site da Receita Federal, informar CPF, data de
       nascimento e digitar o código de verificação do site, e imprimir a página seguinte. Não necessita reconhecer em cartório.
        Acessar: https://www.receita.fazenda.gov.br/Aplicacoes/Atrjo/ConsRest/Atual.app/paginas/index.asp`,
      `Para sócios ou proprietários de empresas e microempresas (MEI) que componham o grupo familiar, apresentar recibo de entrega
       e todas as páginas completas da Declaração de Imposto de Renda de Pessoa Jurídica (IRPJ), Simples Nacional, MEI, ou em caso
       de empresa inativa entregar o documento de baixa da empresa ou declaração de inatividade informadas pela receita federal.`],
    },
    {
      type: 3,
      info: [`Cópia da CTPS de todos os integrantes do grupo familiar a partir de 18 anos ou emancipados,
      mesmo os que estiverem dentro das seguintes condições: desempregados, estagiários, funcionários públicos,
       estudantes, estatuatário/celetista, militáres, aposentados, autônomos, proficionais liberais e proprietários/sócios
        de empresa. Páginas: nº de série (pag da foto), Qualificação Civil (Pag verso da foto), Contrato de Trabalho
        (penúltima e última pags com registro de trabalho e a próxima página em branco imediatamente subsequentes a estas).`,
       'Caso tenha duas CTPS, tirar cópia da antiga e da atual das mesmas páginas acima citadas',
       'No caso de não possuir CTPS, apresentar declaração informando que não possui, com firma reconhecida em cartório'],
    },
    {
      type: 4,
      info: [`ASSALARIADO: No caso de não possuir CTPS, apresentar declaração informando que não possui, com firma
      reconhecida em cartório`,
     `AUTONOMO: Declaração de rendimentos digitada ou a próprio punho, onde deverá constar o valor real bruto
      recebido, ocupação profissional e ser reconhecida em cartório`,
     'PROPRIETARIO OU SÓCIO DE EMPRESA: DECORE ref. ao Pró-labore e aos Lucros Distribuídos recebidos pela empresa.',
     `DESEMPREGADO OU DO LAR: Declaração digitada ou a próprio punho reconhecida em cartório mencionando que está
      desempregado ou que não exerce atividade remunerada por opção própria, informando suas fontes para subsistência (documento original)`,
     `ESTAGIÁRIO:	Contrato de estágio, (termo aditivo se houver) e declaração de rendimentos do órgão competente,
      desde que conste a vigência e o valor da remuneração`,
     `PAIS SEPARADOS, JUDICIALMENTE OU NÃO:	Apresentar o comprovante atualizado de recebimento de pensão alimentícia
      ou declaração de ajuda financeira constando o valor recebido. Caso não haja nenhum tipo de ajuda, também deverá
      ser apresentada declaração de tal fato. Ambas as declarações devem ser reconhecidas em cartório`,
     `APOSENTADOS, VIÚVOS PENSIONISTAS, AUXILIO DOENÇA OU QUALQUER TIPO DE AUXILIO RECEBIDO PELA PREVIDÊNCIA SOCIAL:
      Apresentar o comprovante de recebimento de proventos emitido pelo INSS (detalhamento de rendimentos previdenciários),
      ou extrato do benefício retirado no site do DATAPREV, juntamente com o comprovante bancário referente ao último mês
      recebido (se não conseguir acesso online, deverá procurar o INSS)`,
     `BENEFICIÁRIO DE PROGRAMA SOCIAL: Bolsa Família e/ou Benefício de Prestação Continuada (BCP), apresentar cópia do
      cartão e comprovante de recebimento`,
     'PESSOAS QUE RECEBEM PREVIDÊNCIA PRIVADA: Apresentar o comprovante atualizado do benefício',
     `RECEITAS DE ALUGUEIS, ARRENDAMENTO DE IMÓVEIS E BENS MOVEIS, AJUDA FINANCEIRA REGULAR DE PESSOA QUE NÃO FAÇA
      PARTE DO GRUPO FAMILIAR: Cópia de contratos e comprovante atual do recebimento ou declaração reconhecida em cartório`],
    },
    {
      type: 5,
      info: [`ALUGUEL DE IMÓVEL RESIDENCIAL: Contrato de locação vigente com firma reconhecida e comprovante de
      pagamento do último mês (recibo) e Declaração do Proprietário do imóvel com firma reconhecida, com dados
       do Locador, do Proprietário, Endereço e valor aluguel`,
     `FINANCIAMENTO DE IMÓVEL: Cópia da última prestação paga do imóvel, se for descontado em folha fazer
      declaração reconhecida em cartório`,
     'MORADIA/CASA CEDIDA: Declaração do Proprietário do imóvel com firma reconhecida, com dados do MORADOR, do Proprietário e Endereço',
     `DESPESAS COM SAUDE: •	Laudo médico e/ou parecer com CID (código da doença) e CRM (código registro médico),
      receituário médico e as notas fiscais utilizadas. Não entra valor de plano de saúde.`,
     'DESPESAS COM EDUCAÇÃO: Ultimo comprovante mensal com a entidade educacional (Escola e/ou Faculdade)',
     `DESPESAS AGUA, LUZ E TELEFONE FIXO: Cópia do ultimo comprovante de energia (caso seja compartilhada com
      outras residencias no mesmo terreno, fazer declaração), água (se a água estiver inclusa no condomínio,
      apresentar comprovante e especificar) e telefone fixo (conta de celular e internet não entram no cálculo
      da solicitação de gratuidade) e no caso de não usar água da Sanepar, fazer declaração especificando se é de poço`,
     'DESPESAS COM TRANSPORTE ESCOLAR: Comprovante de pagamento mensal ou contrato de transporte escolar',
     `FINANCIAMENTO DE VEÍCULO: Cópia da última prestação paga do veículo, se for descontado em folha fazer declaração
      reconhecida em cartório`],
    },
    {
      type: 6,
      info: ['Boletim do último bimestre cursado (para alunos veteranos)', 'Cópia do histórico escolar (somente para alunos novatos)']
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
