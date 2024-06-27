export interface Venta {
  id_orden_venta?: number;
  dni: number;
  estado: boolean;
}

export interface Pedido {
  id_pedido?: number;
  idOrdenVenta: number;
  id_medicamento: number;
  cantidad: number;
  precio_unitario: number;
}
