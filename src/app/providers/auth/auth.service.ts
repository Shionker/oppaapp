import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User = JSON.parse(localStorage.getItem('user'));

  constructor(
    private api: ApiService,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public router: Router, // para enviar al usuario a otra vista
    private navController: NavController,
    public toastCtrl: ToastController,
    private loadingController: LoadingController
  ) { }

  async loginWithEmail(email, password?) {
    const loading = await this.loadingController.create({
      message: 'Ingresando...'
    });
    await loading.present()
    this.api.loginWithEmail(email, password).toPromise()
      .then((userData: any) => {
        localStorage.setItem('user', JSON.stringify(userData.user));
        this.ngZone.run(() => {
          this.router.navigate(['/sidemenu/services']);
          loading.dismiss()
        }, err => {
          console.log(err);
          loading.dismiss()
          this.presentToast('No se ha podido crear la cuenta', 'danger');
        });
      })
      .catch(err => {
        loading.dismiss()
        let errMessage: string;
        switch (err.error.message) {
          case 'User is not a client':
            errMessage = 'Usuario no registrado.'
            break
          default:
            errMessage = 'Email y/o contraseña incorrectas.'
            break
        }
        this.presentToast(errMessage, 'danger');
      })
  }

  async loginWithRut(rut, password?) {
    const loading = await this.loadingController.create({
      message: 'Ingresando...'
    });
    await loading.present()
    this.api.loginWithRut(rut, password).toPromise()
      .then((userData: any) => {
        localStorage.setItem('user', JSON.stringify(userData.user));
        this.ngZone.run(() => {
          this.router.navigate(['/welcome']);
          loading.dismiss()
        }, err => {
          console.log(err);
          loading.dismiss()
          this.presentToast('No se ha podido crear la cuenta', 'danger');
        });
      })
      .catch(err => {
        loading.dismiss()
        let errMessage: string;
        switch (err.error.message) {
          case 'User is not a client':
            errMessage = 'Usuario no registrado.'
            break
          default:
            errMessage = 'Rut y/o contraseña incorrectas.'
            break
        }
        this.presentToast(errMessage, 'danger');
      })
  }

  logout() {
    localStorage.removeItem('user');
    this.ngZone.run(() => {
      this.navController.navigateRoot(['login'])
    });
  }

  isLogged() {
    if (localStorage.getItem("user") == null) {
      return false;
    }
    else {
      return true;
    }
  }

  userData() {
    return JSON.parse(localStorage.getItem('user'));
  }

  setUserData(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
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