import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRequestManagementComponent } from './system-request-management.component';

describe('SystemRequestManagementComponent', () => {
  let component: SystemRequestManagementComponent;
  let fixture: ComponentFixture<SystemRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemRequestManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
