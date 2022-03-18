import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from 'src/app/models/service';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { ModalController } from '@ionic/angular';
import { ModalPage } from './modal/modal.page';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

  $services: Observable<Service[]>
  $superCategoriesServices: Observable<any[]>;
  user: User
  apiUrl: string = environment.HOST + '/'
  slideOpts = {
    slidesPerView: this.numberOfCards(),
    centeredSlides: true,
    centeredSlidesBounds: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private modalController: ModalController
  ) {

  }

  async openModal(service: Service) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        service
      }
    })

    modal.onDidDismiss()
      .then((res: any) => {
        if (res.data.reload) this.user = this.auth.userData()
      })
    return await modal.present()
  }

  ngOnInit() {
    console.log('window.innerWidth', window.innerWidth)
    this.user = this.auth.userData()
    // this.$services = this.api.getServices()
    this.$superCategoriesServices = this.api.getSuperCategoriesServices()
  }

  ionViewWillEnter() {
    this.user = this.auth.userData()
  }

  numberOfCards(): number {
    // calculamos el número de tarjetas que se mostrarán en la página segun el ancho de la pantalla
    return window.innerWidth / 300
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.slideOpts.slidesPerView = this.numberOfCards()
    console.log('window.innerWidth', window.innerWidth, 'slidesPerView', this.slideOpts.slidesPerView)
  }


}
