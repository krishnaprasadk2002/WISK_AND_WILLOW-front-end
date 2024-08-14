import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPackagesComponent } from './user-packages.component';

describe('UserPackagesComponent', () => {
  let component: UserPackagesComponent;
  let fixture: ComponentFixture<UserPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPackagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
