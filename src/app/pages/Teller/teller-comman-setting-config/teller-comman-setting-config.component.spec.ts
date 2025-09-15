import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerCommanSettingConfigComponent } from './teller-comman-setting-config.component';

describe('TellerCommanSettingConfigComponent', () => {
  let component: TellerCommanSettingConfigComponent;
  let fixture: ComponentFixture<TellerCommanSettingConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TellerCommanSettingConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TellerCommanSettingConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
