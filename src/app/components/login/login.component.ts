import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    if (this.loginService.login({ username, password })) {
      if (username === 'vendedor') {
        this.router.navigate(['/registrar-venta']);
      } else if (username === 'cajero') {
        this.router.navigate(['/procesar-pago']);
      } else if (username === 'despachador') {
        this.router.navigate(['/despachar-producto']);
      }
    } else {
      alert('Usuario o contraseña incorrecta');
    }
  }
}
