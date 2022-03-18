import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { AddCreditsPage } from './add-credits/add-credits.page';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  user: User
  userSelected: User
  $wallet: Observable<any[]>

  constructor(
    private auth: AuthService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.user = this.auth.userData()
    this.userSelected = this.user
    this.api.getCredit(this.user.user_id).toPromise()
      .then((res: any) => {
        this.user.credit = res.credit
        this.auth.setUserData(this.user)
      })
      .catch(err => {
        console.log(err);
      })
    this.$wallet = this.api.getWalletHistory(this.user.user_id)
  }

  async changeUserSelected() {
    let buttons = []
    buttons.push({
      text: this.user.firstname + ' ' + this.user.lastname,
      handler: () => {
        this.userSelected = this.user
        this.$wallet = this.api.getWalletHistory(this.user.user_id)
      }
    })
    this.user.elders.forEach(elder => {
      buttons.push({
        text: elder.firstname + ' ' + elder.lastname,
        handler: () => {
          this.userSelected = elder
          this.$wallet = this.api.getWalletHistory(elder.user_id)
        }
      })
    })
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar usuario',
      buttons
    });
    await actionSheet.present();
  }

  async addCredits() {
    const modal = await this.modalController.create({
      component: AddCreditsPage,
      componentProps: {
        user: this.userSelected,
      }
    });

    modal.onDidDismiss()
      .then(res => {
        this.api.getCredit(this.userSelected.user_id).toPromise()
          .then((res: any) => {
            this.userSelected.credit = res.credit
            this.auth.setUserData(this.userSelected)
          })
          .catch(err => {
            console.log(err);
          })
        this.$wallet = this.api.getWalletHistory(this.userSelected.user_id)
      })

    return await modal.present();
  }

}
