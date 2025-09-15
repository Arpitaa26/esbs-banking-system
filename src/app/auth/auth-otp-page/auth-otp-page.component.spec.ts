import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthOtpPageComponent } from './auth-otp-page.component';

describe('AuthOtpPageComponent', () => {
  let component: AuthOtpPageComponent;
  let fixture: ComponentFixture<AuthOtpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthOtpPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthOtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
