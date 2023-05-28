import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoDialogComponent } from './avaliacao-dialog.component';

describe('AvaliacaoDialogComponent', () => {
  let component: AvaliacaoDialogComponent;
  let fixture: ComponentFixture<AvaliacaoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvaliacaoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvaliacaoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
