import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingEventComponent } from './wedding-event.component';

describe('WeddingEventComponent', () => {
  let component: WeddingEventComponent;
  let fixture: ComponentFixture<WeddingEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeddingEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeddingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
