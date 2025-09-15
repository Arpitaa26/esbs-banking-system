import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintConfigurationComponent } from './print-configuration.component';

describe('PrintConfigurationComponent', () => {
  let component: PrintConfigurationComponent;
  let fixture: ComponentFixture<PrintConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
