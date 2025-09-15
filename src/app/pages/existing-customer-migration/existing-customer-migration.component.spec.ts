import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingCustomerMigrationComponent } from './existing-customer-migration.component';

describe('ExistingCustomerMigrationComponent', () => {
  let component: ExistingCustomerMigrationComponent;
  let fixture: ComponentFixture<ExistingCustomerMigrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingCustomerMigrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingCustomerMigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
