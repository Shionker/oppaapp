import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { NewRecordPage } from './new-record/new-record.page';

@Component({
  selector: 'app-clinical-record',
  templateUrl: './clinical-record.page.html',
  styleUrls: ['./clinical-record.page.scss'],
})
export class ClinicalRecordPage implements OnInit {

  user: User
  userSelected: User
  $userRecords: Observable<any>

  constructor(
    private auth: AuthService,
    private actionSheetController: ActionSheetController,
    private api: ApiService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.user = this.auth.userData()
    this.userSelected = this.user
    this.$userRecords = this.api.getUserRecords(this.user.user_id)
  }

  async changeUserSelected() {
    let buttons = []
    buttons.push({
      text: this.user.firstname + ' ' + this.user.lastname,
      handler: () => {
        this.userSelected = this.user
        this.$userRecords = this.api.getUserRecords(this.user.user_id)
      }
    })
    this.user.elders.forEach(elder => {
      buttons.push({
        text: elder.firstname + ' ' + elder.lastname,
        handler: () => {
          this.userSelected = elder
          this.$userRecords = this.api.getUserRecords(this.userSelected.user_id)
        }
      })
    })
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar usuario',
      buttons
    });
    await actionSheet.present();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: NewRecordPage,
      componentProps: {
        userSelected: this.userSelected
      }
    })

    modal.onDidDismiss()
      .then((res: any) => {
        if (res.data.reload) this.$userRecords = this.api.getUserRecords(this.userSelected.user_id)
      })
    return await modal.present()
  }

}
