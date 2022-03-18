import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { LocationService } from 'src/app/providers/location/location.service';
import { LoadingController } from '@ionic/angular';
import * as dayjs from 'dayjs';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api/api.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/providers/web-socket/web-socket.service';
import * as faker from 'faker/locale/es_MX'
import { Router } from '@angular/router';
import { NewAddressPage } from 'src/app/pages/new-address/new-address.page';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  user: User
  minDate: string = dayjs().format('YYYY-MM-DD')
  maxDate: string = dayjs().add(2, 'month').format('YYYY-MM-DD')
  minHour: string = dayjs().format('HH:mm')
  $regions: Observable<Location>
  $districts: Observable<Location>
  scheduleServiceForm: FormGroup
  newAddressForm: FormGroup
  elderSelected: User
  apiUrl: string = environment.HOST + '/'
  requestingStatus: string = 'requesting'
  provider_has_services_provider_has_services_id: number
  isLoading: boolean = false
  isPaymentAccepted: boolean = false

  ActionSheetOptionsRegions = {
    header: 'Regiones',
    subHeader: 'Seleccione su región'
  };
  ActionSheetOptionsDistricts = {
    header: 'Comunas',
    subHeader: 'Seleccione su comuna'
  };
  ActionSheetOptionsElder = {
    header: 'Servicio para:'
  };

  constructor(
    private modalController: ModalController,
    private auth: AuthService,
    private location: LocationService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private api: ApiService,
    private alertController: AlertController,
    private dateFormat: DatePipe,
    private toastCtrl: ToastController,
    private iab: InAppBrowser,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public router: Router, // para enviar al usuario a otra vista
    private ws: WebSocketService
  ) { }

  @Input() public service: Service

  ngOnInit() {
    this.user = this.auth.userData()
    this.scheduleServiceForm = this.createScheduleServiceForm()
    this.$regions = this.location.getRegions()
    this.newAddressForm = this.createNewAddressForm()

    // We connect to the server
    this.ws.connect()
  }

  createScheduleServiceForm() {
    return this.formBuilder.group({
      date: [null, Validators.required],
      hour: [null, Validators.required],
      receptor: [(this.user?.elders.length) ? null : this.user, Validators.required],
      address: [null, Validators.required],
      service: [this.service, Validators.required],
      paymentMethod: [null, Validators.required],
      price: [this.service.price, Validators.required],
    })
  }

  createNewAddressForm() {
    return this.formBuilder.group({
      users_user_id: [this.user.user_id, Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      other: [null],
      district: ['', Validators.required],
      region: ['', Validators.required],
    })
  }

  setMinHour() {
    this.scheduleServiceForm.controls.hour.reset()
    this.minHour = (dayjs(this.scheduleServiceForm.value.date).format('YYYY-MM-DD') == dayjs().format('YYYY-MM-DD')) ? dayjs().add(2, 'h').format('HH:mm') : dayjs('2022-01-01').format('HH:mm')
  }

  closeModal(reload: boolean) {
    this.modalController.dismiss({
      reload
    })
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      color
    });
    toast.present();
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      buttons: ['ACEPTAR'],
      backdropDismiss: false,
      message
    });

    alert.present();
  }

  async scheduleService() {
    // comprobamos el formulario y, si está bien, comenzamos la solicitud
    if (this.scheduleServiceForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Buscando proveedores...'
      });
      await loading.present();
      this.isLoading = true

      // formateamos la data antes de enviarla
      if (this.scheduleServiceForm.value.receptor.token) delete this.scheduleServiceForm.value.receptor.token
      this.scheduleServiceForm.value.date = dayjs(this.scheduleServiceForm.value.date).format('YYYY-MM-DD')
      this.scheduleServiceForm.value.hour = (this.scheduleServiceForm.value.hour.includes('T') > 0) ? this.scheduleServiceForm.value.hour.split('T')[1].slice(0, 5) : this.scheduleServiceForm.value.hour

      // solicitamos una lista con los posibles proveedores
      this.api.getPotentialProviders(this.scheduleServiceForm.value.address.region, this.scheduleServiceForm.value.address.district, this.scheduleServiceForm.value.service.service_id, this.scheduleServiceForm.value.date, this.scheduleServiceForm.value.hour, this.user.gender).toPromise()
        .then((res: any) => {
          loading.dismiss();
          this.isLoading = false
          console.log(res);

          // si existe un proveedor con el mismo user_id lo eliminamos del arreglo
          res.potentialServices = res.potentialServices.filter(element => element.user_id !== 1)

          if (res.potentialServices?.length) {
            // si hay servicios agendables, se envía una solicitud proveedor por proveedor hasta que se encuentre uno que acepte el servicio
            this.sendRequestToProvider(res.potentialServices)
          } else {
            // en caso de no haber servicios agendables, se muestra un mensaje de error
            this.presentAlert('No se encontraron proveedores disponibles', 'En esta fecha y/u horario no hay proveedores disponibles.')
          }
        })
        .catch(err => {
          console.log(err)
          loading.dismiss();
          this.presentToast('Hubo un error al intentar obtener los proveedores', 'danger')
        })
    } else {
      this.presentToast('Faltan campos por rellenar', 'danger')
    }
  }

  async sendRequestToProvider(potentialServices: any[]) {
    const loading = await this.loadingController.create({
      message: 'Solicitando servicio a proveedor...'
    });
    await loading.present();
    this.isLoading = true

    let requestId = faker.random.uuid()
    sessionStorage.setItem('requestId', requestId)

    console.log('notification WS:', {
      type: 'service request',
      emitter: this.user.user_id,
      destination: potentialServices[0].providers_users_user_id,
      message: this.scheduleServiceForm.value,
      state: 'data sended',
      id: requestId
    })
    this.ws.emit('notification', {
      type: 'service request',
      emitter: this.user.user_id,
      destination: potentialServices[0].providers_users_user_id,
      message: this.scheduleServiceForm.value,
      state: 'data sended',
      id: requestId
    })
    console.log('id enviado al solicitar servicio: ', requestId)

    const notifyingProvider = this.ws.listen('notification').subscribe(async (data: any) => {
      this.requestingStatus = 'requesting'
      requestId = data.id
      console.log('id recibida al responder proveedor: ', data.id)
      console.log(data);

      if (data.type === 'service request' && data.state === 'request accepted' && data.id === requestId) {
        loading.dismiss();
        this.isLoading = false
        notifyingProvider.unsubscribe()

        const alert = await this.alertController.create({
          backdropDismiss: false,
          header: 'Agendar Servicio',
          message: `Tu servicio será agendado con ${data.provider.firstname} ${data.provider.lastname} para el próximo ${this.dateFormat.transform(this.scheduleServiceForm.value.date, 'fullDate')} a las ${this.scheduleServiceForm.value.hour} horas.`,
          buttons: [{
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.ws.emit('notification', {
                type: 'service request',
                emitter: this.user.user_id,
                destination: potentialServices[0].providers_users_user_id,
                message: this.scheduleServiceForm.value,
                state: 'service canceled by client',
                id: requestId
              })
              console.log('Agendar servicio cancelado');

              // registramos la cancelación del servicio
              this.registerCancelService('Service canceled by client')
            }
          }, {
            text: 'Pagar',
            handler: async () => {
              console.log('Agendando servicio', this.scheduleServiceForm.value.paymentMethod);
              this.provider_has_services_provider_has_services_id = potentialServices[0].provider_has_services_id

              // si el proveedor acepta realizar el servicio, procedemos al pago según el método seleccionado
              if (this.scheduleServiceForm.value.paymentMethod === 'wallet') this.paymentWithWallet(data, notifyingProvider)
              if (this.scheduleServiceForm.value.paymentMethod === 'webpay') this.paymentWithWebpay(data, notifyingProvider)
            }
          }]
        })

        await alert.present();

      } else if (data.type === 'service request' && data.state === 'provider busy' && data.id === requestId) {
        console.log('el proveedor está ocupado');
        console.count()
        if (potentialServices.length > 1) {
          loading.dismiss();
          this.isLoading = false
          potentialServices.shift()
          if (potentialServices.length) {
            notifyingProvider.unsubscribe()
            this.sendRequestToProvider(potentialServices)
          } else {
            notifyingProvider.unsubscribe()
            this.presentToast('No se encontraron proveedores disponibles en esta fecha y/u horario', 'danger')
          }
        } else if (potentialServices.length <= 1) { // si el proveedor cancela por estar ocupado, volvemos a solicitar el servicio luego de un tiempo
          setTimeout(() => {
            loading.dismiss();
            this.isLoading = false
            notifyingProvider.unsubscribe()
            this.sendRequestToProvider(potentialServices)
          }, 1000)
        }
      } else if (data.type === 'service request' && data.state === 'request rejected' && data.id === requestId) {
        loading.dismiss();
        this.isLoading = false
        potentialServices.shift()
        if (potentialServices.length) {
          notifyingProvider.unsubscribe()
          this.registerCancelService('Service canceled by provider')
          this.sendRequestToProvider(potentialServices)
        } else {
          notifyingProvider.unsubscribe()
          this.presentToast('No se encontraron proveedores disponibles en esta fecha y/u horario', 'danger')
        }
      } else if (data.id !== requestId) {
        /**
         * si la notificación no tiene el mismo id que la solicitud,
         * se asume que proviene de un proveedor anterior descartado
         * por timeout y le avisamos al proveedor que se cancela su
         * solicitud.
         */
        this.ws.emit('notification', {
          type: 'service request',
          emitter: this.user.user_id,
          destination: data.emitter,
          message: this.scheduleServiceForm.value,
          state: 'service canceled by timeout',
          id: faker.random.uuid()
        })
      }
    })

    // si pasa un tiempo definido, se cancela la solicitud
    setTimeout(() => {
      console.log('timeOut', this.isLoading, sessionStorage.getItem('requestId') === requestId)
      if (this.isLoading && sessionStorage.getItem('requestId') === requestId) {
        loading.dismiss(); // quitamos el loading
        notifyingProvider.unsubscribe() // desuscribimos al observador de las notificaciones
        this.ws.emit('notification', { // emitimos una notificación para que el proveedor cancele la solicitud por timeout
          type: 'service request',
          emitter: this.user.user_id,
          destination: potentialServices[0].providers_users_user_id,
          message: this.scheduleServiceForm.value,
          state: 'service canceled by timeout',
          id: faker.random.uuid()
        })

        this.registerCancelService('service canceled by timeout')// registramos la cancelación del servicio

        potentialServices.shift() // eliminamos el proveedor que no contestó de la lista de proveedores
        if (potentialServices.length) this.sendRequestToProvider(potentialServices) // volvemos a solicitar el servicio si quedan proveedores
        else this.presentToast('No se encontraron proveedores disponibles en estas fechas y/u horarios', 'danger') // si no quedan proveedores, mostramos un mensaje de error
      }
    }, 1000 * 60 * 1) // 1000 * 60 * 2
  }

  paymentWithWallet(data, notifyingProvider) {
    this.requestingStatus = 'paying off'
    console.log('pagando con Wallet');
    this.api.payWithWallet({
      amount: this.service.price,
      type: 'pago',
      user_id: this.user.user_id
    }).toPromise()
      .then((res: any) => {
        console.log({ res });
        const registerPaymentData = {
          amount: this.service.price,
          state: 'en proceso',
          providers_provider_id: data.provider.provider_id,
          clients_client_id: this.scheduleServiceForm.value.receptor.client_id,
          buyOrder: res.buyOrder,
          services_service_id: this.service.service_id
        }
        this.api.scheduleService2({
          clients_client_id: this.scheduleServiceForm.value.receptor.client_id,
          clients_users_user_id: this.scheduleServiceForm.value.receptor.user_id,
          date: this.scheduleServiceForm.value.date,
          start: this.scheduleServiceForm.value.hour,
          provider_has_services_provider_has_services_id: this.provider_has_services_provider_has_services_id,
          addresses_address_id: this.scheduleServiceForm.value.address.address_id,
          addresses_users_user_id: this.scheduleServiceForm.value.receptor.user_id,
          price: this.scheduleServiceForm.value.price,
          registerPaymentData
        }).toPromise()
          .then(async (res2: any) => {
            notifyingProvider.unsubscribe()
            if (res.success) {
              this.user.credit = res.credits.total
              this.auth.setUserData(this.user)
              this.closeModal(true);
              this.presentAlert('Servicio agendado', 'El pago del servicio se ha procesado y el servicio ha sido agendado correctamente.');

              this.ws.emit('notification', {
                type: 'client payment',
                emitter: this.user.user_id,
                destination: data.provider.user_id,
                message: `Servicio pagado y agendado`,
                state: 'payment accepted'
              });

              // ahora solicitamos la creacion de la sala de chat
              this.createChat(data, res2)

              // enviamos al usuario a la vista de historial de servicios
              this.ngZone.run(() => {
                this.router.navigate([`/sidemenu/history/${this.scheduleServiceForm.value.receptor.client_id}`]);
              });
            }
          })
          .catch(err => {
            notifyingProvider.unsubscribe()
            console.log('error al registrar servicio agendado', err);
            this.closeModal(false);
            this.presentToast('Error al agendar servicio', 'danger');
            this.ws.emit('notification', {
              type: 'service request',
              emitter: this.user.user_id,
              destination: data.provider.user_id,
              message: `Error al registrar servicio agendado`,
              state: 'payment rejected'
            });
          })
      })

  }

  paymentWithWebpay(data, notifyingProvider) {
    this.requestingStatus = 'paying off'
    console.log('pagando con Webpay', data);

    this.pay(data, {
      clients_client_id: this.scheduleServiceForm.value.receptor.client_id,
      clients_users_user_id: this.scheduleServiceForm.value.receptor.user_id,
      date: this.scheduleServiceForm.value.date,
      start: this.scheduleServiceForm.value.hour,
      provider_has_services_provider_has_services_id: this.provider_has_services_provider_has_services_id,
      addresses_address_id: this.scheduleServiceForm.value.address.address_id,
      addresses_users_user_id: this.scheduleServiceForm.value.receptor.user_id,
      price: this.scheduleServiceForm.value.price
    }, notifyingProvider, this.scheduleServiceForm.value.price)
  }

  async pay(data, scheduleServiceData, notifyingProvider, price) {
    const loading = await this.loadingController.create({
      message: 'Procesando pago...'
    });
    await loading.present()

    this.api.registerPayment({
      "buy_order": "CLTBK" + dayjs().format('YYYYMMDDHHmmss'),
      "session_id": `user_${this.user.user_id}`,
      "amount": price,
      "return_url": `${this.apiUrl}api/transbank/check`
    }).toPromise()
      .then(res => {

        const browser = this.iab.create(`${res.url}?token_ws=${res.token}`, '_blank', 'location=no');

        const loadstopSubscription = browser.on('loadstop').subscribe((event: InAppBrowserEvent) => {
          this.getVoucher(res.token, data, scheduleServiceData, notifyingProvider, price, loading, browser)
        });

        const exitSubscription = browser.on('exit').subscribe((event: InAppBrowserEvent) => {
          browser.close()
          loadstopSubscription.unsubscribe()
          exitSubscription.unsubscribe()
        });

      })
      .catch(err => {
        console.log(err)
        loading.dismiss()
        this.ws.emit('notification', {
          type: 'service request',
          emitter: this.user.user_id,
          destination: data.provider.user_id,
          message: `Cancelado por error del cliente al realizar pago`,
          state: 'payment rejected'
        });
        this.presentToast('Error al pagar', 'danger')
      })
  }

  getVoucher(token_ws, data, scheduleServiceData, notifyingProvider, price, loading, browser) {
    this.api.getVoucher({ token_ws }).toPromise()
      .then(async res => {
        console.log({ status: res.status, isPaymentAccepted: this.isPaymentAccepted });

        if (res.status === 'INITIALIZED') {
          this.getVoucher(token_ws, data, scheduleServiceData, notifyingProvider, price, loading, browser)
        } else if (res.status === 'AUTHORIZED' && !this.isPaymentAccepted) {
          this.isPaymentAccepted = true
          browser.close()
          const registerPaymentData = {
            amount: this.service.price,
            state: 'en proceso',
            providers_provider_id: data.provider.provider_id,
            clients_client_id: this.scheduleServiceForm.value.receptor.client_id,
            buyOrder: res.buy_order,
            services_service_id: this.service.service_id
          }

          // agregamos la data que registra el pago, para que administración sepa a que proveedor debe pagarle y cuanto
          scheduleServiceData.registerPaymentData = registerPaymentData
          this.api.scheduleService2(scheduleServiceData).toPromise()
            .then(async (res2: any) => {
              notifyingProvider.unsubscribe()
              loading.dismiss()

              // si el pago esta autorizado, hacemos commit a Transbank
              await this.api.confirmPayWithWebpay(token_ws)

              this.closeModal(true);
              this.presentAlert('Servicio agendado', 'El pago se ha procesado y el servicio ha sido agendado correctamente.');

              this.ws.emit('notification', {
                type: 'client payment',
                emitter: this.user.user_id,
                destination: data.provider.user_id,
                message: `Servicio pagado y agendado`,
                state: 'payment accepted'
              });

              // ahora solicitamos la creacion de la sala de chat
              this.createChat(data, res2)

              // enviamos al usuario a la vista de historial de servicios
              this.ngZone.run(() => {
                this.router.navigate([`/sidemenu/history/${scheduleServiceData.clients_client_id}`]);
              });
            })
            .catch(err => {
              notifyingProvider.unsubscribe()
              loading.dismiss()
              console.log('error al registrar servicio agendado', err);
              this.closeModal(false);
              this.presentToast('Error al agendar servicio', 'danger');
              this.ws.emit('notification', {
                type: 'service request',
                emitter: this.user.user_id,
                destination: data.provider.user_id,
                message: `Error al registrar servicio agendado`,
                state: 'payment rejected'
              });
            })
          this.presentToast('Pago aceptado', 'success')
        } else if (res.status !== 'AUTHORIZED' && res.status !== 'INITIALIZED') {
          browser.close()
          loading.dismiss()
          this.presentToast('Error al pagar', 'danger')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  createChat(data, newServiceData) {
    let newChat = {
      users_ids: [data.provider.user_id, this.scheduleServiceForm.value.receptor.user_id],
      provider_img_url: data.provider.img_url,
      provider_name: data.provider.firstname + ' ' + data.provider.lastname,
      receptor_img_url: this.scheduleServiceForm.value.receptor.img_url,
      receptor_name: this.scheduleServiceForm.value.receptor.firstname + ' ' + this.scheduleServiceForm.value.receptor.lastname,
      title: this.service.title,
      scheduled_services_scheduled_services_id: newServiceData.scheduleService.scheduled_services_id
    }
    if (this.scheduleServiceForm.value.receptor.user_id !== this.user.user_id) newChat.users_ids.push(this.user.user_id)
    this.api.createChat(newChat).toPromise()
      .then((res: any) => {
        console.log('chat creado');
      })
      .catch(err => {
        console.log('error al crear chat', err);
      })
  }

  registerCancelService(reason: string) {
    this.api.scheduleService2({
      clients_client_id: this.scheduleServiceForm.value.receptor.client_id,
      clients_users_user_id: this.scheduleServiceForm.value.receptor.user_id,
      date: this.scheduleServiceForm.value.date,
      start: this.scheduleServiceForm.value.hour,
      provider_has_services_provider_has_services_id: this.provider_has_services_provider_has_services_id,
      addresses_address_id: this.scheduleServiceForm.value.address.address_id,
      addresses_users_user_id: this.scheduleServiceForm.value.receptor.user_id,
      state: reason,
      price: this.scheduleServiceForm.value.price
    }).toPromise()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  async addAddress() {
    const modal = await this.modalController.create({
      component: NewAddressPage,
      componentProps: {
        user: this.scheduleServiceForm.value.receptor
      }
    })

    modal.onDidDismiss()
      .then((res: any) => {
        if (res.data.reload && this.scheduleServiceForm.value.receptor.user_id === this.user.user_id) {
          this.user.addresses = res.data.receptorAddresses;
          this.auth.setUserData(this.user);
        } else if (res.data.reload && this.scheduleServiceForm.value.receptor.user_id !== this.user.user_id) {
          const elderIndex = this.user.elders.findIndex(elder => elder.user_id === this.scheduleServiceForm.value.receptor.user_id);
          console.log({ elderIndex });
          if (elderIndex !== -1) {
            this.user.elders[elderIndex].addresses = res.data.receptorAddresses;
            this.auth.setUserData(this.user);
          }
        }
      })
      .catch(err => {
        console.log(err);
      })

    return await modal.present()
  }

}
