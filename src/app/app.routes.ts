import { provideRouter, Routes } from '@angular/router';
import { RegistrarVentaComponent } from './components/registrar-venta/registrar-venta.component';
import { ProcesarPagoComponent } from './components/procesar-pago/procesar-pago.component';
import { DespacharProductoComponent } from './components/despachar-producto/despachar-producto.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: 'registrar-venta', component: RegistrarVentaComponent },
  { path: 'procesar-pago', component: ProcesarPagoComponent },
  { path: 'despachar-producto', component: DespacharProductoComponent },
  { path: '', component: LoginComponent }, // Ruta principal
  { path: 'login', component: LoginComponent }
];

export const appRoutingProviders: any[] = [];

export const routing = provideRouter(routes);
