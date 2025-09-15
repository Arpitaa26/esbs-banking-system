import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyAuditLogsComponent } from './third-party-audit-logs.component';

describe('ThirdPartyAuditLogsComponent', () => {
  let component: ThirdPartyAuditLogsComponent;
  let fixture: ComponentFixture<ThirdPartyAuditLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdPartyAuditLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdPartyAuditLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
