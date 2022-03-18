import { Component, QueryList, ViewChildren } from '@angular/core';

import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Autostart } from '@ionic-native/autostart/ngx';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  constructor(
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    public router: Router,
    private alertController: AlertController,
    private autostart: Autostart
  ) {
    this.setPortrait();
    this.autostart.enable();
    this.backButtonEvent();

    // cargamos el darkMode según lo guardado en el localStorage
    if (localStorage.getItem('darkMode') === 'on') {
      document.body.setAttribute('data-theme', 'dark');
      // this.darkMode = true
    } else {
      document.body.setAttribute('data-theme', 'light');
      // this.darkMode = false
    }
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet?.canGoBack() && (this.router.url !== '/sidemenu/services')) {
          outlet.pop();
        } else {
          this.presentAlert();
        }
      });
    });
  }

  // set orientation to portrait
  setPortrait() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  async presentAlert() {
    localStorage.setItem('createElderAccountAlert', 'done')
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Desea salir de la aplicación?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('no cerrar app');
        }
      }, {
        text: 'Salir',
        handler: async () => {
          console.log('cerrando app');
          navigator['app'].exitApp();
        }
      }]
    })

    await alert.present();
  }

  ionViewDidEnter() {
    SplashScreen.hide();
  }

}
