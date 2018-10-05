import { ReleaseNotesDataComponent } from './../release-notes-data/release-notes-data.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ReleaseNotesStore } from '../../release-notes.store';
import { SidenavService } from '../../../../core/services/sidenav.service';

@Component({
  selector: 'app-release-notes-form',
  templateUrl: './release-notes-form.component.html',
  styleUrls: ['./release-notes-form.component.scss']
})
export class ReleaseNotesFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formNotes: FormArray;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private store: ReleaseNotesStore,
    private sidenavService: SidenavService,
    private releaseNotesDataComponent: ReleaseNotesDataComponent
  ) { }

  ngOnInit() {
    this.initForm();
    this.releaseNotesDataComponent.openSidenav();
  }

  ngOnDestroy(): void {
    this.releaseNotesDataComponent.closeSidenav();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      version: [null, [Validators.required, Validators.minLength, Validators.maxLength]]
    });
    this.formNotes = this.formBuilder.array([this.returnNote()]);
    this.loading = !this.loading;
  }

  private returnNote() {
    return this.formBuilder.group({
      id: 0,
      description: [null, [Validators.required]],
      isBug: [false]
    });
  }

  public addNote() {
    const lastNote = this.formNotes.value[this.formNotes.length - 1];
    if (lastNote.note !== null && lastNote.note !== '') {
      this.formNotes.push(this.returnNote());
    }
  }

  public removeNote(i: number) {
    const control = <FormArray>this.formNotes;
    control.removeAt(i);
  }

  public saveReleaseNotes() {
    const releaseNotes = {
      ...this.form.value,
      notes: this.formNotes.value[0].description == null ? [] : this.formNotes.value
    };
    if (this.form.valid && this.formNotes.valid) {
      this.store.saveReleaseNotes(releaseNotes);
    }
  }

  public closeSidenav() {
    this.sidenavService.close();
  }
}
