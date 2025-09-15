import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogsDetailsComponent } from './audit-logs-details.component';

describe('AuditLogsDetailsComponent', () => {
  let component: AuditLogsDetailsComponent;
  let fixture: ComponentFixture<AuditLogsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditLogsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditLogsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
