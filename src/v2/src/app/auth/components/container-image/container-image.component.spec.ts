import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerImageComponent } from './container-image.component';

describe('ContainerImageComponent', () => {
  let component: ContainerImageComponent;
  let fixture: ComponentFixture<ContainerImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
