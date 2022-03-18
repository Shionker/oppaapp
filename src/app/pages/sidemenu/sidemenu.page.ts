import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { WebSocketService } from 'src/app/providers/web-socket/web-socket.service';
import { environment } from 'src/environments/environment';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.page.html',
  styleUrls: ['./sidemenu.page.scss'],
})
export class SidemenuPage implements OnInit {

  pages = [
    { title: 'Servicios',               icon: 'construct-outline',        url: '/sidemenu/services'},
    { title: 'Mis Datos y Apadrinados', icon: 'person-outline',           url: '/sidemenu/account'},
    { title: 'Ficha clínica',           icon: 'document-text-outline',    url: '/sidemenu/clinical-record'},
    { title: 'Mensajes',                icon: 'chatbox-ellipses-outline', url: '/sidemenu/messages'},
    { title: 'Monedero',                icon: 'wallet-outline',           url: '/sidemenu/wallet'},
    { title: 'Mis Servicios',           icon: 'document-text-outline',    url: '/sidemenu/history'},
    { title: 'Ayuda',                   icon: 'help-circle-outline',      url: '/sidemenu/help'},
  ]

  selectedPath = ''
  darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches || false;

  user: User
  apiUrl: string = environment.HOST + '/'

  constructor(
    private auth: AuthService,
    protected ws: WebSocketService,
    private api: ApiService,
    private alertController: AlertController,
    public router: Router,
    private toastCtrl: ToastController,
    private localNotifications: LocalNotifications,
    private androidPermissions: AndroidPermissions
  ) { }
  
  ngOnInit() {

    // verificamos que la aplicación tenga permisos para usar gps
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
    );
    // verificamos que la aplicación tenga permisos para usar almacenamiento
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE)
    );
    // verificamos que la aplicación tenga permisos para usar cámara
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );

    this.user = this.auth.userData()
    this.pages[5].url += `/${this.user.client_id}` 
    this.api.getCredit(this.user.user_id).toPromise()
      .then((data: any) => {
        this.user.credit = data.credit
        this.auth.setUserData(this.user)
      })

    if (localStorage.getItem('darkMode') === 'on') this.darkMode = true
    if (localStorage.getItem('darkMode') === 'off') this.darkMode = false
    
    if (localStorage.getItem('createElderAccountAlert') !== 'done') this.presentAlert()

    this.ws.connect();
    this.ws.emit('notificationsUser', { // aqui el cliente se suscribe a las notificaciones
      user_id: this.user.user_id,
      client_id: this.user.client_id
    });
    this.ws.listen('notificateUser').subscribe((data: any) => { 
      //cuando llega una notificación, hace lo siguiente
      this.localNotifications.schedule({
        id: 1,
        title: `Nuevo mensaje de ${data.firstname} ${data.lastname}`,
        text: `${data.text}`,
        launch: true
      });
      
      if (this.router.url !== '/sidemenu/messages' && data.type === 'message') this.presentToast(`Nuevo mensaje de ${data.firstname} ${data.lastname}:\n${data.text}`, 'dark')
    })
  }
  
  ionViewWillEnter() {
    this.user = this.auth.userData()
  }

  logout() {
    this.auth.logout()
  }

  onClick(event){
    if(event.detail.checked){
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('darkMode', 'on');
    }
    else{
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('darkMode', 'off');
    }
  }

  async presentAlert() {
    localStorage.setItem('createElderAccountAlert', 'done')
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: '¿Sabías que puedes apadrinar a tu adulto mayor?',
      message: `Si quieres crear la cuenta de tu Oppa Senior, puedes hacerlo desde el apartado Mis Datos.`,
      buttons: [{
        text: 'Ahora no',
        role: 'cancel',
        handler: () => {
          console.log('cancela apadrinar');
        }
      }, {
        text: 'Ir',
        handler: async () => {
          console.log('quiere apadrinar');
          this.router.navigate(['/sidemenu/account']);
        }
      }]
    })

    await alert.present();
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
