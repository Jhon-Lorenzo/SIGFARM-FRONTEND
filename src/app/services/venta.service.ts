import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../utils/backend-config';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrlInventarioListar = `${BASE_URL}/inventario/listar`;
  private apiUrlInventarioBuscar = `${BASE_URL}/inventario/search`;
  private apiUrlOrdenVentaInsert = `${BASE_URL}/orden_venta/insert`;
  private apiUrlPedidoInsert = `${BASE_URL}/pedido/insert`;
  private apiUrlClienteInsert = `${BASE_URL}/cliente/insert`;

  constructor(private http: HttpClient) { }

  getInventarioListar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlInventarioListar);
  }

  searchInventario(id_medicamento: number): Observable<any> {
    const params = new HttpParams().set('id_medicamento', id_medicamento.toString());
    return this.http.get<any>(this.apiUrlInventarioBuscar, { params });
  }

  insertOrdenVenta(ordenVenta: any): Observable<any> {
    return this.http.post<any>(this.apiUrlOrdenVentaInsert, ordenVenta);
  }

  insertPedido(pedido: any): Observable<any> {
    return this.http.post<any>(this.apiUrlPedidoInsert, pedido);
  }

  insertCliente(cliente: any): Observable<any> {
    return this.http.post<any>(this.apiUrlClienteInsert, cliente);
  }
}