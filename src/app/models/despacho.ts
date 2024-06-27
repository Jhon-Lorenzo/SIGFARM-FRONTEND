export interface Pedido {
    id_pedido: number;
    id_orden_venta: number;
    id_medicamento: number;
    cantidad: number;
    precio_unitario: number;
    inventario: {
      nombre_medicamento: string;
      ubicacion_del_medicamento: string;
    };
  }
  
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
  