import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiLogsComponent } from './api-logs.component';

describe('ApiLogsComponent', () => {
  let component: ApiLogsComponent;
  let fixture: ComponentFixture<ApiLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
