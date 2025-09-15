import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingOnboardingCustomerDetailComponent } from './existing-onboarding-customer-detail.component';

describe('ExistingOnboardingCustomerDetailComponent', () => {
  let component: ExistingOnboardingCustomerDetailComponent;
  let fixture: ComponentFixture<ExistingOnboardingCustomerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingOnboardingCustomerDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingOnboardingCustomerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
