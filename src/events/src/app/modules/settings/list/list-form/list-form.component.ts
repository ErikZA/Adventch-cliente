import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ListService } from '../list.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent implements OnInit {

  public formList: FormGroup;
  public isEdit = false;
  public id: string;

  constructor(
    public dialogRef: MatDialogRef<ListFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private list: ListService
  ) { }

  ngOnInit() {

    this.formList = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      items: this.fb.array([]),
    })

    const firstField = this.formList.controls.items as FormArray


    if (this.data !== undefined && this.data !== null) {
      this.isEdit = true;
      this.id = this.data.id;
      this.list.One(this.data.id).then((res: any) => {
        const { name, description, items } = res.data[0]
        this.formList.controls["name"].setValue(name)
        this.formList.controls["description"].setValue(description)

        for (let item of items) {
          firstField.push(this.fb.group({
            description: [item.description, Validators.required],
          }))
        }
      })
    } else {
      firstField.push(this.fb.group({
        description: ['', Validators.required],
      }))
    }

  }

  get getItem() {
    return this.formList.controls.items as FormArray;
  }

  addListItem() {
    const field = this.formList.controls.items as FormArray;
    field.push(this.fb.group({
      description: ['', Validators.required],
    }));
  }

  remove(i: any) {
    const field = this.formList.controls.items as FormArray;
    field.removeAt(i);
  }

  CreateList() {
    const { name, description, items } = this.formList.value;
    this.list.Create(this.dialogRef, name, description, items)
  }

  UpdateList() {
    const { name, description, items } = this.formList.value;
    this.list.Update(this.dialogRef, this.id, name, description, items)
  }

}
