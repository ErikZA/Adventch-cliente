import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ScholarshipService } from '../../../scholarship.service';
import { Process } from '../../../models/process';
import { ProcessUploadViewModel } from '../../../interfaces/process-view-models';
import { auth } from '../../../../../auth/auth';

@Component({
  selector: 'app-process-data-download',
  templateUrl: './process-data-download.component.html',
  styleUrls: ['./process-data-download.component.scss']
})
export class ProcessDataDownloadComponent implements OnInit {
  process: Process;
  files: ProcessUploadViewModel[] = [];
  showList = 10;


  constructor(
    public scholarshipService: ScholarshipService,
    public dialogRef: MatDialogRef<ProcessDataDownloadComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.process = data.process;
  }

  ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.scholarshipService
    .getProcessUploads(this.process.id)
    .subscribe(files => {
      if (files) {
        this.files =  files;
      }
    });
  }

  public cancel(): void {
    this.dialogRef.close(null);
  }

  public onScroll(): void {
    this.showList += 10;
  }

  public download(process): void {
    const unit = auth.getCurrentUnit();
    this.scholarshipService
    .getFile(process.id, unit.id)
    .subscribe(dataURL => {
      console.log(dataURL);
      const fileUrl = URL.createObjectURL(dataURL);
      const element = document.createElement('a');
      element.href = fileUrl;
      element.download = process.name;
      element.target = '_blank';
      element.click();
      // this.snackBar.open('Relatório gerado com sucesso.', 'OK', { duration: 5000 });
    }, err => {
        console.log(err);
        // this.snackBar.open('Erro ao gerar relatório, tente novamente.', 'OK', { duration: 5000 });
    });
  }
}
