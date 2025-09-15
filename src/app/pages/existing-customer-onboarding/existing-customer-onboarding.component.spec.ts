import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingCustomerOnboardingComponent } from './existing-customer-onboarding.component';

describe('ExistingCustomerOnboardingComponent', () => {
  let component: ExistingCustomerOnboardingComponent;
  let fixture: ComponentFixture<ExistingCustomerOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingCustomerOnboardingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingCustomerOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
