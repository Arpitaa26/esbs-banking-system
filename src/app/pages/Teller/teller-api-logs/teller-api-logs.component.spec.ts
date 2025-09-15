import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerApiLogsComponent } from './teller-api-logs.component';

describe('TellerApiLogsComponent', () => {
  let component: TellerApiLogsComponent;
  let fixture: ComponentFixture<TellerApiLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TellerApiLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TellerApiLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
