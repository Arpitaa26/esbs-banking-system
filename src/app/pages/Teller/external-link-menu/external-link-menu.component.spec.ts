import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLinkMenuComponent } from './external-link-menu.component';

describe('ExternalLinkMenuComponent', () => {
  let component: ExternalLinkMenuComponent;
  let fixture: ComponentFixture<ExternalLinkMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalLinkMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalLinkMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
