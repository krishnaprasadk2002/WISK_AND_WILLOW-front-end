import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpNavComponent } from './emp-nav.component';

describe('EmpNavComponent', () => {
  let component: EmpNavComponent;
  let fixture: ComponentFixture<EmpNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
