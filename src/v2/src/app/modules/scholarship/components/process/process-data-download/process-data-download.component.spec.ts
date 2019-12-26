import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessDataDownloadComponent } from './process-data-download.component';

describe('ProcessDataDownloadComponent', () => {
  let component: ProcessDataDownloadComponent;
  let fixture: ComponentFixture<ProcessDataDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessDataDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDataDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
