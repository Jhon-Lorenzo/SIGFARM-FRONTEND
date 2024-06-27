import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { DespachoService } from '../../services/despacho.service';

@Component({
  selector: 'app-despachar-producto',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './despachar-producto.component.html',
  styleUrls: ['./despachar-producto.component.css']
})
export class DespacharProductoComponent implements OnInit {
  despachoForm: FormGroup;
  medicamentos: any[] = [];
  estadoValidacion: string = '';

  constructor(private fb: FormBuilder, private despachoService: DespachoService) {
    this.despachoForm = this.fb.group({
      ordenVenta: ['', Validators.required],
      nombreCliente: [{ value: '', disabled: true }],
      correo: [{ value: '', disabled: true }],
      validacion: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {}

  buscarOrdenVenta() {
    const idOrdenVenta = this.despachoForm.get('ordenVenta')?.value;

    this.despachoService.buscarOrdenVenta(idOrdenVenta).subscribe(
      response => {
        if (response) {
          const cliente = response.cliente;
          this.estadoValidacion = response.estado ? 'Pagado' : 'No Pagado';

          this.despachoForm.patchValue({
            nombreCliente: cliente.nombres + ' ' + cliente.apellidos,
            correo: cliente.correo,
            validacion: `${this.estadoValidacion} - ${response.estado ? 'efectivo' : ''}`
          });

          if (response.estado) {
            this.listarPedidosPorOrdenVenta(idOrdenVenta);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'La orden de venta no está pagada',
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró la orden de venta',
          });
        }
      },
      error => {
        console.error('Error al obtener la orden de venta:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Orden de venta no existe',
        });
      }
    );
  }

  listarPedidosPorOrdenVenta(idOrdenVenta: number) {
    this.despachoService.listarPedidosPorOrdenVenta(idOrdenVenta).subscribe(
      data => {
        console.log('Pedidos recibidos:', data); // Log de depuración
        this.medicamentos = data.map(pedido => ({
          nombre: pedido.inventario.nombre_medicamento,
          cantidad: pedido.cantidad,
          ubicacion: pedido.inventario.ubicacion_del_medicamento
        }));
      },
      error => {
        console.error('Error al listar los pedidos por orden de venta:', error);
      }
    );
  }

  despachar() {
    Swal.fire({
      icon: 'success',
      title: 'Producto Despachado',
      text: 'El producto ha sido despachado con éxito',
    }).then(() => {
      location.reload(); // Refrescar la página después de despachar el producto
    });
  }
}
