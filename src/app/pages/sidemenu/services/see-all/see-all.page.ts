import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Service } from 'src/app/models/service';
import { ApiService } from 'src/app/providers/api/api.service';
import { environment } from 'src/environments/environment';
import { ModalPage } from '../modal/modal.page';
import { FilterModalPage } from './filter-modal/filter-modal.page';

@Component({
  selector: 'app-see-all',
  templateUrl: './see-all.page.html',
  styleUrls: ['./see-all.page.scss'],
})
export class SeeAllPage implements OnInit {

  superCategoryTitle: string
  $services: Observable<Service[]>
  private params: Subscription = new Subscription();
  apiUrl: string = environment.HOST + '/'
  orderBy: string = 'alphaAsc'

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private modalController: ModalController,
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.params = this.route.paramMap.subscribe(params => {
      this.superCategoryTitle = params.get('superCategoryTitle')
    });
    this.$services = this.api.getServicesBySuperCategoryTitle(this.superCategoryTitle)
  }

  ionViewWillLeave() {
    this.params.unsubscribe()
  }

  async openModal(service: Service) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        service
      }
    })

    return await modal.present()
  }

  async openFilterModal(mode: string) {
    let modalType: string
    switch(mode) {
      case 'orderBy':
        modalType = 'action-sheet-modal-medium'
        break
      case 'priceRange':
        modalType = 'action-sheet-modal-small'
        break
      default:
        modalType = 'action-sheet-modal'
        break
    }
    const modal = await this.modalController.create({
      component: FilterModalPage,
      componentProps: {
        mode,
        orderBy: this.orderBy
      },
      cssClass: modalType
    })

    modal.onDidDismiss()
      .then((res: any) => {
        if (res.data.filter) this.orderBy = res.data.filter
      })

    return await modal.present()
  }

  async presentActionSheetOrderBy() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ordenar por',
      buttons: [
        {
          text: 'Nombre',
          icon: 'swap-vertical-outline',
          handler: () => {
            console.log('Delete clicked');
          }
        }, {
          text: 'Precio menor a mayor',
          icon: 'cash-outline',
          handler: () => {
            console.log('Share clicked');
          }
        }, {
          text: 'Precio mayor a menor',
          icon: 'cash-outline',
          handler: () => {
            console.log('Play clicked');
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentActionSheetPriceRange() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ordenar por',
      buttons: [
        {
          text: '$0 - $10.000',
          icon: 'cash-outline',
          handler: () => {
            console.log('Delete clicked');
          }
        }, {
          text: '$10.000 - $20.000',
          icon: 'cash-outline',
          handler: () => {
            console.log('Share clicked');
          }
        }, {
          text: '$20.000 - $30.000',
          icon: 'cash-outline',
          handler: () => {
            console.log('Play clicked');
          }
        }, {
          text: '$30.000 - ++',
          icon: 'cash-outline',
          handler: () => {
            console.log('Play clicked');
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

}
