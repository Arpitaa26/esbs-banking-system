import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenLabelComponent } from './screen-label.component';

describe('ScreenLabelComponent', () => {
  let component: ScreenLabelComponent;
  let fixture: ComponentFixture<ScreenLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenLabelComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScreenLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
