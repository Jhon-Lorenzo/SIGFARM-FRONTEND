import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../services/pago.service';
import { OrdenVenta } from '../../models/pago';

@Component({
  selector: 'app-procesar-pago',
  standalone: true,
  providers: [PagoService],
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './procesar-pago.component.html',
  styleUrls: ['./procesar-pago.component.css']
})
export class ProcesarPagoComponent implements OnInit {
  pagoForm: FormGroup;
  metodosPago: string[] = ['Tarjeta', 'Efectivo'];
  mostrarFormularioTarjeta = false;
  mostrarFormularioEfectivo = false;

  constructor(private fb: FormBuilder, private pagoService: PagoService) {
    this.pagoForm = this.fb.group({
      ordenVenta: ['', Validators.required],
      nombreCliente: [{ value: '', disabled: true }],
      correo: [{ value: '', disabled: true }],
      montoPagar: [{ value: '', disabled: true }],
      metodoPago: ['', Validators.required],
      montoDado: [''],
      vuelto: [{ value: '', disabled: true }],
      titularTarjeta: [''],
      numeroTarjeta: [''],
      fechaVencimiento: [''],
      cvv: ['']
    });
  }

  ngOnInit(): void {}

  buscarOrdenVenta() {
    const idOrdenVenta = this.pagoForm.get('ordenVenta')?.value;

    this.pagoService.listarPedidosPorOrdenVenta(idOrdenVenta).subscribe(
      (data) => {
        if (data && data.length > 0) {
          console.log('Buscar Orden de Venta - ID:', idOrdenVenta);
          console.log('Datos recibidos de listarPorOrdenVenta:', data);
          const cliente = data[0].ordenVenta.cliente;
          const montoTotal = data.reduce((sum, pedido) => sum + (pedido.cantidad * pedido.precio_unitario), 0);

          this.pagoForm.patchValue({
            nombreCliente: cliente.nombres + ' ' + cliente.apellidos,
            correo: cliente.correo,
            montoPagar: montoTotal
          });

          Swal.fire({
            icon: 'success',
            title: 'Orden de Venta Encontrada',
            text: `Cliente: ${cliente.nombres} ${cliente.apellidos}`,
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontraron pedidos para esta orden de venta',
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al buscar la orden de venta',
        });
      }
    );
  }

  onMetodoPagoChange() {
    const metodoPago = this.pagoForm.get('metodoPago')?.value;
    this.mostrarFormularioTarjeta = metodoPago === 'Tarjeta';
    this.mostrarFormularioEfectivo = metodoPago === 'Efectivo';
  }

  efectuarPago() {
    const idOrdenVenta = this.pagoForm.get('ordenVenta')?.value;

    if (this.mostrarFormularioEfectivo) {
      const montoDado = parseFloat(this.pagoForm.get('montoDado')?.value);
      const montoPagar = parseFloat(this.pagoForm.get('montoPagar')?.value);
      const vuelto = parseFloat((montoDado - montoPagar).toFixed(3));

      this.pagoForm.patchValue({
        vuelto: vuelto
      });

      console.log('Efectuar Pago - ID Orden Venta:', idOrdenVenta);
      console.log('Monto Dado:', montoDado, 'Monto Pagar:', montoPagar, 'Vuelto:', vuelto);

      Swal.fire({
        icon: 'success',
        title: 'Pago Efectuado',
        text: `El vuelto es: ${vuelto}`,
      }).then(() => {
        this.actualizarEstadoOrdenVenta(idOrdenVenta);
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Pago Efectuado',
        text: 'El pago ha sido realizado con éxito',
      }).then(() => {
        this.actualizarEstadoOrdenVenta(idOrdenVenta);
      });
    }
  }

  actualizarEstadoOrdenVenta(idOrdenVenta: number) {
    const requestBody = { id_orden_venta: idOrdenVenta };

    console.log('Actualizar Estado Orden Venta - ID:', idOrdenVenta);

    this.pagoService.buscarOrdenVenta(requestBody).subscribe(
      response => {
        console.log('Orden de venta encontrada:', response);
        if (response) {
          const ordenVenta = response;
          ordenVenta.estado = true; // Actualizar el estado a true

          this.pagoService.actualizarOrdenVenta(ordenVenta).subscribe(
            updateResponse => {
              console.log('Orden de venta actualizada:', updateResponse);
            },
            error => {
              console.error('Error al actualizar la orden de venta:', error);
            }
          );
        } else {
          console.error('No se encontró la orden de venta con el ID proporcionado.');
        }
      },
      error => {
        console.error('Error al obtener la orden de venta:', error);
      }
    );
  }

  generarTicket() {
    Swal.fire({
      icon: 'success',
      title: 'Ticket Generado',
      text: 'El ticket ha sido generado con éxito',
    }).then(() => {
      location.reload(); // Refrescar la página después de generar el ticket
    });
  }
}
