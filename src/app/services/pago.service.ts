import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenVenta, Pago } from '../models/pago';
import { BASE_URL } from '../utils/backend-config';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrlOrdenVentaSearch = `${BASE_URL}/orden_venta/search`;
  private apiUrlOrdenVentaUpdate = `${BASE_URL}/orden_venta/update`;
  private apiUrlPedidoListarPorOrdenVenta = `${BASE_URL}/pedido/listarPorOrdenVenta/`;

  constructor(private http: HttpClient) {}

  listarPedidosPorOrdenVenta(idOrdenVenta: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlPedidoListarPorOrdenVenta}${idOrdenVenta}`);
  }

  buscarOrdenVenta(requestBody: any): Observable<OrdenVenta> {
    return this.http.post<OrdenVenta>(this.apiUrlOrdenVentaSearch, requestBody);
  }

  actualizarOrdenVenta(ordenVenta: OrdenVenta): Observable<OrdenVenta> {
    return this.http.post<OrdenVenta>(this.apiUrlOrdenVentaUpdate, ordenVenta);
  }
}
