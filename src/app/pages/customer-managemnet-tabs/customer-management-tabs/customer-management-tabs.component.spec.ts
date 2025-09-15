import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerManagementTabsComponent } from './customer-management-tabs.component';

describe('CustomerManagementTabsComponent', () => {
  let component: CustomerManagementTabsComponent;
  let fixture: ComponentFixture<CustomerManagementTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerManagementTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerManagementTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
