import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProcessDataPendencyFileComponent } from './student-process-data-pendency-file.component';

describe('StudentProcessDataPendencyFileComponent', () => {
  let component: StudentProcessDataPendencyFileComponent;
  let fixture: ComponentFixture<StudentProcessDataPendencyFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentProcessDataPendencyFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProcessDataPendencyFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
