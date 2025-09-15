import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLinkMenuAddEditComponent } from './external-link-menu-add-edit.component';

describe('ExternalLinkMenuAddEditComponent', () => {
  let component: ExternalLinkMenuAddEditComponent;
  let fixture: ComponentFixture<ExternalLinkMenuAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalLinkMenuAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalLinkMenuAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
