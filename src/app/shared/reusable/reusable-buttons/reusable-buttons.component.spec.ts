import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableButtonsComponent } from './reusable-buttons.component';

describe('ReusableButtonsComponent', () => {
  let component: ReusableButtonsComponent;
  let fixture: ComponentFixture<ReusableButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
