import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiLogDetailsComponent } from './api-log-details.component';

describe('ApiLogDetailsComponent', () => {
  let component: ApiLogDetailsComponent;
  let fixture: ComponentFixture<ApiLogDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiLogDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
