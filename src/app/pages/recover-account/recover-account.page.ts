import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api/api.service';

@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.page.html',
  styleUrls: ['./recover-account.page.scss'],
})
export class RecoverAccountPage implements OnInit {

  recoverAccountForm: FormGroup
  changePassForm: FormGroup
  step: number = 1
  public passConfirmationWrong = null

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    public router: Router // para enviar al usuario a otra vista
  ) { }

  ngOnInit() {
    this.recoverAccountForm = this.createRecoverAccountForm()
    this.changePassForm = this.createChangePassForm()
  }

  createRecoverAccountForm() {
    return this.formBuilder.group({
      rut: ['', Validators.required]
    })
  }

  createChangePassForm() {
    return this.formBuilder.group({
      code: ['', Validators.required],
      password: ['', Validators.required],
      checkPassword: ['', Validators.required]
    })
  }

  async getCode() {
    const loading = await this.loadingController.create({
      message: 'Solicitando código...'
    });
    await loading.present()
    this.api.getCode(this.recoverAccountForm.value).toPromise()
      .then((res: any) => {
        this.step = 2
        loading.dismiss()
      })
      .catch(err => {
        loading.dismiss()
        this.step = 1
        this.presentToast('Error al solicitar código. Intente nuevamente.', 'danger')
      })
  }

  sendNewPass() {
    let data = {
      code: this.changePassForm.value.code,
      password: this.changePassForm.value.password,
      rut: this.recoverAccountForm.value.rut
    }
    this.api.changePass(data).toPromise()
      .then(() => {
        this.presentToast('Contraseña cambiada con éxito.', 'success')
        this.router.navigate(['/login'])
        this.step = 1
        this.recoverAccountForm.reset()
        this.changePassForm.reset()
      })
      .catch(err => {
        this.presentToast('Error al cambiar contraseña. Intente nuevamente.', 'danger')
      })
  }

  // confirm new password validator
  onPasswordChange() {
    if (this.confirm_password.value == this.password.value) {
      this.confirm_password.setErrors({ mismatch: false });
      this.passConfirmationWrong = false;
    } else {
      this.confirm_password.setErrors({ mismatch: true });
      this.passConfirmationWrong = true;
    }
  }

  // getting the form control elements
  get password(): AbstractControl {
    return this.changePassForm.controls['password'];
  }

  get confirm_password(): AbstractControl {
    return this.changePassForm.controls['checkPassword'];
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color
    });
    toast.present();
  }

}
