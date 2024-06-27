import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '../utils/backend-config';
@Injectable({
  providedIn: 'root'
})
export class DespachoService {
  private apiUrlOrdenVentaSearch = `${BASE_URL}/orden_venta/search`;
  private apiUrlPedidoListarPorOrdenVenta = `${BASE_URL}/pedido/listarPorOrdenVenta/`;

  constructor(private http: HttpClient) {}

  buscarOrdenVenta(idOrdenVenta: number): Observable<any> {
    return this.http.post<any>(this.apiUrlOrdenVentaSearch, { id_orden_venta: idOrdenVenta });
  }

  listarPedidosPorOrdenVenta(idOrdenVenta: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlPedidoListarPorOrdenVenta}${idOrdenVenta}`);
  }
}
