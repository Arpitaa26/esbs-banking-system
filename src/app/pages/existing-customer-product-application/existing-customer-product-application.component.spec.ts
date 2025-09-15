import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingCustomerProductApplicationComponent } from './existing-customer-product-application.component';

describe('ExistingCustomerProductApplicationComponent', () => {
  let component: ExistingCustomerProductApplicationComponent;
  let fixture: ComponentFixture<ExistingCustomerProductApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingCustomerProductApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingCustomerProductApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
