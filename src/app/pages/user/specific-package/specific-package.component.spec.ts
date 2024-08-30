import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificPackageComponent } from './specific-package.component';

describe('SpecificPackageComponent', () => {
  let component: SpecificPackageComponent;
  let fixture: ComponentFixture<SpecificPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificPackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecificPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
