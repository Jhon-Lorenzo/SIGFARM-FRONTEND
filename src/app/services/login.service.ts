import { Injectable } from '@angular/core';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  login(user: Login): boolean {
    // Aquí puedes implementar la lógica de autenticación.
    // Por simplicidad, vamos a asumir que todos los logins son correctos.
    if ((user.username === 'vendedor' || user.username === 'cajero' || user.username === 'despachador') && user.password) {
      return true;
    }
    return false;
  }
}
