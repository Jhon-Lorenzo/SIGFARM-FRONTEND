export interface OrdenVenta {
  id_orden_venta: number;
  dni: number;
  estado: boolean;
  cliente: {
    dni: number;
    nombres: string;
    apellidos: string;
    direccion: string;
    telefono: number;
    correo: string;
  };
}

export interface Pago {
  id_pago: number;
  id_orden_venta: number;
  monto: number;
  fecha: string;
  metodo_pago: string;
}
