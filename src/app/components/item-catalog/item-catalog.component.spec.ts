import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCatalogComponent } from './item-catalog.component';

describe('ItemCatalogComponent', () => {
  let component: ItemCatalogComponent;
  let fixture: ComponentFixture<ItemCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCatalogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
