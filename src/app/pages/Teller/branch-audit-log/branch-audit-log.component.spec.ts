import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAuditLogComponent } from './branch-audit-log.component';

describe('BranchAuditLogComponent', () => {
  let component: BranchAuditLogComponent;
  let fixture: ComponentFixture<BranchAuditLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchAuditLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchAuditLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
