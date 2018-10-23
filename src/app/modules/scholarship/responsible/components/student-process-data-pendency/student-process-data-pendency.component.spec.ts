import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProcessDataPendencyComponent } from './student-process-data-pendency.component';

describe('StudentProcessDataPendencyComponent', () => {
  let component: StudentProcessDataPendencyComponent;
  let fixture: ComponentFixture<StudentProcessDataPendencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentProcessDataPendencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProcessDataPendencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
