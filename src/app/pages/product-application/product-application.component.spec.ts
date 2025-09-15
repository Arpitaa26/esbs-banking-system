import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductApplicationComponent } from './product-application.component';

describe('ProductApplicationComponent', () => {
  let component: ProductApplicationComponent;
  let fixture: ComponentFixture<ProductApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
