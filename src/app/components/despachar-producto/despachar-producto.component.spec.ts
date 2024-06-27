import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespacharProductoComponent } from './despachar-producto.component';

describe('DespacharProductoComponent', () => {
  let component: DespacharProductoComponent;
  let fixture: ComponentFixture<DespacharProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespacharProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespacharProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
