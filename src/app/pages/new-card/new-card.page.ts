import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api/api.service';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.page.html',
  styleUrls: ['./new-card.page.scss'],
})
export class NewCardPage implements OnInit {

  cardDataForm: FormGroup
  buyOrder: string
  @Input() public price: number

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.cardDataForm = this.createCardDataForm()
  }

  createCardDataForm() {
    return this.formBuilder.group({
      type: ['', Validators.required],
      cardNumber: ['', Validators.required],
      cvv: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required],
      amount: [this.price, Validators.required]
    })
  }

  async pay() {
    const loading = await this.loadingController.create({
      message: 'Procesando pago...'
    });
    await loading.present()
    this.cardDataForm.value.cardNumber = this.cardDataForm.value.cardNumber.toString()
    this.api.payWithWebpay(this.cardDataForm.value).toPromise()
      .then((res: any) => {
        loading.dismiss()
        console.log(res)
        this.api.confirmPayWithWebpay({ transactionToken: res.transactionData.createResponse.token }).toPromise()
          .then((res: any) => {
            this.buyOrder = res.confirmResponse.buy_order
            if (res.confirmResponse.status == 'AUTHORIZED') {
              this.closeModal(true)
            } else {
              // cancelar todo
            }
          })
          .catch(err => {
            this.closeModal(false)
          })
      })
      .catch(err => {
        loading.dismiss()
        console.log('error al pagar', err);
        this.presentToast('Error al procesar el pago', 'danger')
      })
  }

  async closeModal(pay: boolean) {
    if (pay) {
      await this.modalController.dismiss({
        transactionOk: pay,
        buyOrder: this.buyOrder
      })
    } else {
      await this.modalController.dismiss()
    }
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
