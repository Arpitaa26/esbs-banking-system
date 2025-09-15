import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDenominationComponent } from './view-denomination.component';

describe('ViewDenominationComponent', () => {
  let component: ViewDenominationComponent;
  let fixture: ComponentFixture<ViewDenominationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDenominationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDenominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
