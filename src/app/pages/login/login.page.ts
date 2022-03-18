import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as faker from 'faker/locale/es_MX'
import { AuthService } from 'src/app/providers/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup
  darkMode = false

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.createLoginForm()
  }

  @ViewChild('passwordEyeRegister', { read: ElementRef }) passwordEye: ElementRef;
  // Seleccionamos el elemento con el nombre que le pusimos con el #
  passwordTypeInput = 'password';
  // Variable para cambiar dinamicamente el tipo de Input que por defecto sera 'password'

  // Esta función verifica si el tipo de campo es texto lo cambia a password y viceversa, además verificara el icono si es 'eye-off' lo cambiara a 'eye' y viceversa
  togglePasswordMode() {
    //cambiar tipo input
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    //obtener el input
    const nativeEl = this.passwordEye.nativeElement.querySelector('input');
    //obtener el indice de la posición del texto actual en el input
    const inputSelection = nativeEl.selectionStart;
    //ejecuto el focus al input
    nativeEl.focus();
    //espero un milisegundo y actualizo la posición del indice del texto
    setTimeout(() => {
      nativeEl.setSelectionRange(inputSelection, inputSelection);
    }, 1);

  }

  login() {
    this.auth.loginWithRut(this.loginForm.value.rut, this.loginForm.value.password)
  }

  createLoginForm() {
    return this.formBuilder.group({
      // email: ['', Validators.email],
      password: ['', Validators.required],
      rut: ['', Validators.required]
    })
  }

}
