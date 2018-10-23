import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import { ResponsibleService } from '../../responsible.service';
import { StudentProcessDataComponent } from '../student-process-data/student-process-data.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-student-process-data-pendency-file',
  templateUrl: './student-process-data-pendency-file.component.html',
  styleUrls: ['./student-process-data-pendency-file.component.scss']
})
export class StudentProcessDataPendencyFileComponent implements OnInit {
  isSending = false;

  @Input()
  process: any;

  filesSelecteds: Array<any>;

  constructor(
    private responsibleService: ResponsibleService,
    private studentProcessDataComponent: StudentProcessDataComponent,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.filesSelecteds = [];
  }

  public inputChanged(input): void {
    this.updateFiles(input.files);
  }

  private updateFiles(files): void {
    for (let i = 0; i < files.length; i++) {
      this.filesSelecteds.push(files[i]);
    }
  }

  public download(file) {
    const blob = new Blob([file]);
    const fileUrl = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = fileUrl;
    element.download = file.name;
    element.target = '_blank';
    element.click();
  }

  public remove(file, index) {
    const files = [];
    for (let i = 0; i < this.filesSelecteds.length; i++) {
      if (index !== i) {
        files.push(this.filesSelecteds[i]);
      }
    }
    this.filesSelecteds = files;
  }

  public openWindow(process) {
    document.getElementById(process.protocol).click();
  }

  public save() {
    this.isSending = true;
    this.responsibleService
    .saveFiles(this.process.id, this.filesSelecteds)
    .subscribe(() => this.studentProcessDataComponent.ngOnInit(),
      () => this.snackBar.open('Erro ao gerar relatório, tente novamente.', 'OK', { duration: 5000 }),
      () => this.isSending = false
    );
  }
}
