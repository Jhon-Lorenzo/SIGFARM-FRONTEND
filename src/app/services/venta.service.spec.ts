import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VentaService } from './venta.service';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../utils/backend-config';

describe('VentaService', () => {
  let service: VentaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VentaService]
    });
    service = TestBed.inject(VentaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch inventory list', () => {
    const mockInventory = [{ id_medicamento: 1, nombre_medicamento: 'Med1', precio_unitario: 10 }];

    service.getInventarioListar().subscribe(data => {
      expect(data).toEqual(mockInventory);
    });

    const req = httpMock.expectOne(`${BASE_URL}/inventario/listar`);
    expect(req.request.method).toBe('GET');
    req.flush(mockInventory);
  });

  it('should search inventory by ID', () => {
    const mockMedicamento = { id_medicamento: 1, nombre_medicamento: 'Med1', precio_unitario: 10 };

    service.searchInventario(1).subscribe(data => {
      expect(data).toEqual(mockMedicamento);
    });

    const req = httpMock.expectOne(`${BASE_URL}/inventario/search?id_medicamento=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMedicamento);
  });

  it('should insert order sale', () => {
    const mockOrder = { id_orden_venta: 123 };
    const orderData = { dni: '12345678', estado: false };

    service.insertOrdenVenta(orderData).subscribe(data => {
      expect(data).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(`${BASE_URL}/orden_venta/insert`);
    expect(req.request.method).toBe('POST');
    req.flush(mockOrder);
  });

  it('should insert pedido', () => {
    const mockPedido = {};
    const pedidoData = { idOrdenVenta: 123, id_medicamento: 1, cantidad: 1, precio_unitario: 10 };

    service.insertPedido(pedidoData).subscribe(data => {
      expect(data).toEqual(mockPedido);
    });

    const req = httpMock.expectOne(`${BASE_URL}/pedido/insert`);
    expect(req.request.method).toBe('POST');
    req.flush(mockPedido);
  });

  it('should insert client', () => {
    const mockClient = {};
    const clientData = { dni: '12345678', nombres: 'John', apellidos: 'Doe', direccion: 'Street 123', telefono: '987654321', correo: 'john.doe@example.com' };

    service.insertCliente(clientData).subscribe(data => {
      expect(data).toEqual(mockClient);
    });

    const req = httpMock.expectOne(`${BASE_URL}/cliente/insert`);
    expect(req.request.method).toBe('POST');
    req.flush(mockClient);
  });
});
