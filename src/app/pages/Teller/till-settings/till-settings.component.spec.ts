import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TillSettingsComponent } from './till-settings.component';

describe('TillSettingsComponent', () => {
  let component: TillSettingsComponent;
  let fixture: ComponentFixture<TillSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TillSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TillSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
