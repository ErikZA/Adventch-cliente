import { DocumentProcessDataInterface } from './../../../interfaces/document-process-data-interface';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-process-data-document-info',
  templateUrl: './process-data-document-info.component.html',
  styleUrls: ['./process-data-document-info.component.scss']
})
export class ProcessDataDocumentInfoComponent implements OnInit {

  @Input() type: number;
  @Input() documents: DocumentProcessDataInterface[];
  loading = false;
  constructor() { }

  ngOnInit() {
    console.log(this.documents);

    if (this.type && this.documents) {
      this.loading = true;
    }
  }

  public getNameTypeDocument(): string {
    switch (this.type) {
      case 1:
        return 'Documentos pessoais';
      case 2:
        return 'Declaração do imposto de renda';
      case 3:
        return 'Carteira de trabalho';
      case 4:
        return 'Comprovante de rendimentos';
      case 5:
        return 'Comprovante de despesas';
      case 6:
        return 'Comprovante acadêmico';
      default:
        break;
    }
  }

}
