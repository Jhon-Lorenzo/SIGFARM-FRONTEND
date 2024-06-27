import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../services/venta.service'; // Importar el servicio

@Component({
  selector: 'app-registrar-venta',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './registrar-venta.component.html',
  styleUrls: ['./registrar-venta.component.css'],
  providers: [VentaService]
})
export class RegistrarVentaComponent implements OnInit {
  ventaForm: FormGroup;
  inventario: any[] = [];
  inventarioFiltrado: any[] = [];
  medicamentos: any[] = [];
  selectedMedicamentoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
  ) {
    this.ventaForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.obtenerInventario();
  }

  obtenerInventario() {
    this.ventaService.getInventarioListar().subscribe(
      (data) => {
        console.log('Inventario obtenido:', data); // Log para depuración
        this.inventario = data;
        this.medicamentos = data; // Guardar los medicamentos para el combo box
      },
      (error) => {
        console.error('Error al obtener el inventario:', error);
      }
    );
  }

  buscarInventario() {
    console.log('Buscar inventario por ID:', this.selectedMedicamentoId); // Log para depuración
    if (this.selectedMedicamentoId !== null) {
      this.ventaService.searchInventario(this.selectedMedicamentoId).subscribe(
        (data) => {
          console.log('Datos del medicamento:', data); // Log para depuración
          this.inventarioFiltrado.push({
            ...data,
            cantidadSolicitada: 1,
            precioTotal: data.precio_unitario
          });
          console.log('Inventario filtrado:', this.inventarioFiltrado); // Log para depuración
        },
        (error) => {
          console.error('Error al buscar el inventario:', error);
        }
      );
    }
  }

  actualizarPrecioTotal(item: any) {
    item.precioTotal = item.cantidadSolicitada * item.precio_unitario;
  }

  eliminarArticulo(index: number) {
    this.inventarioFiltrado.splice(index, 1);
  }

  generarTicket() {
    const clienteDni = this.ventaForm.get('dni')?.value; // Obtener el DNI del cliente

    const ordenVenta = {
      dni: clienteDni,
      estado: false
    };

    // Enviar el DNI del cliente a la tabla orden_venta
    this.ventaService.insertOrdenVenta(ordenVenta).subscribe(
      response => {
        const ordenDeVentaId = response.id_orden_venta; // Obtener el ID de la orden de venta generada

        if (!ordenDeVentaId) {
          Swal.fire('Error', 'No se pudo obtener el ID de la orden de venta', 'error');
          return;
        }

        // Enviar los detalles de cada medicamento a la tabla pedidos
        this.inventarioFiltrado.forEach(item => {
          const pedido = {
            idOrdenVenta: ordenDeVentaId,
            id_medicamento: item.id_medicamento,
            cantidad: item.cantidadSolicitada,
            precio_unitario: item.precio_unitario
          };

          this.ventaService.insertPedido(pedido).subscribe(
            pedidoResponse => {
              console.log('Pedido registrado:', pedidoResponse);
            },
            error => {
              console.error('Error al registrar el pedido:', error);
            }
          );
        });

        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: 'El ticket ha sido generado con éxito',
          html: `
            <p>Orden de venta:</p>
            <p><strong>Nº ${ordenDeVentaId}</strong></p>
            <button class="btn btn-primary" id="enviarCorreo">Enviar a correo</button>
          `,
          showConfirmButton: false
        });

        // Agregar evento al botón dentro de SweetAlert2
        setTimeout(() => {
          const enviarCorreoButton = document.getElementById('enviarCorreo');
          if (enviarCorreoButton) {
            enviarCorreoButton.addEventListener('click', () => {
              Swal.fire('Correo enviado', 'El ticket ha sido enviado a su correo', 'success').then(() => {
                location.reload(); // Refrescar la página después de enviar el correo
              });
            });
          }
        }, 100);
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al generar el ticket', 'error');
      }
    );
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Evitar la recarga de la página
    if (this.ventaForm.valid) {
      this.ventaService.insertCliente(this.ventaForm.value)
        .subscribe(response => {
          Swal.fire('Venta registrada', 'Los datos han sido registrada con éxito', 'success');
        }, error => {
          Swal.fire('Error', 'Hubo un problema al registrar Los datos', 'error');
        });
    } else {
      this.mostrarErroresValidacion();
    }
  }

  mostrarErroresValidacion() {
    const camposInvalidos = [];
    for (const control in this.ventaForm.controls) {
      if (this.ventaForm.controls[control].invalid) {
        camposInvalidos.push(control);
      }
    }
    Swal.fire({
      icon: 'error',
      title: 'Error de Validación',
      text: 'Por favor, complete todos los campos obligatorios: ' + camposInvalidos.join(', ')
    });
  }
}