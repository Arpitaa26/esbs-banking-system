import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenLabelDetailsComponent } from './screen-label-details.component';

describe('ScreenLabelDetailsComponent', () => {
  let component: ScreenLabelDetailsComponent;
  let fixture: ComponentFixture<ScreenLabelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenLabelDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenLabelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
