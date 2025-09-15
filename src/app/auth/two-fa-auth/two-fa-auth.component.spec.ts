import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFaAuthComponent } from './two-fa-auth.component';

describe('TwoFaAuthComponent', () => {
  let component: TwoFaAuthComponent;
  let fixture: ComponentFixture<TwoFaAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoFaAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoFaAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
