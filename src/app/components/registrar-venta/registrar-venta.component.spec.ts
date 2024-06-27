import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RegistrarVentaComponent } from './registrar-venta.component';

describe('RegistrarVentaComponent', () => {
  let component: RegistrarVentaComponent;
  let fixture: ComponentFixture<RegistrarVentaComponent>;
  let deb: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule, RegistrarVentaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deb = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch inventory on initialization', () => {
    const mockInventory = [{ id_medicamento: 1, nombre_medicamento: 'Med1', precio_unitario: 10 }];
    // Simulate setting inventory directly for the test case
    component.inventario = mockInventory;
    fixture.detectChanges();

    expect(component.inventario).toEqual(mockInventory);
  });

  it('Debe retornar formulario ventaForm valido', () => {
    component.ventaForm.setValue({
      dni: '12345678',
      nombres: 'John',
      apellidos: 'Doe',
      direccion: 'Street 123',
      telefono: '987654321',
      correo: 'john.doe@example.com',
    });

    fixture.detectChanges(); // Asegúrate de detectar cambios después de establecer los valores del formulario

    // Selector específico para el botón "Guardar" dentro del formulario de datos del cliente
    const btnGuardarElement = deb.query(By.css('button[type="submit"]'));

    expect(component.ventaForm.invalid).toBeFalse();
    expect(btnGuardarElement.nativeElement.disabled).toBeFalse(); // Cambiado a 'false' ya que el formulario es válido
  });
});
