import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';

@Component({
  selector: 'app-new-record',
  templateUrl: './new-record.page.html',
  styleUrls: ['./new-record.page.scss'],
})
export class NewRecordPage implements OnInit {

  newRecordForm: FormGroup
  @Input() public userSelected: User
  customActionSheetOptions: any = {
    header: 'Seleccione un tipo de registro'
  };
  user: User

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    private api: ApiService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.user = this.auth.userData()
    this.newRecordForm = this.createNewRecordForm()
  }

  createNewRecordForm() {
    return this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      icon: [null, Validators.required],
      icon_type: ['null', Validators.required],
      users_user_id: [this.userSelected.user_id, Validators.required]
    })
  }

  setIconType() {
    switch (this.newRecordForm.value.icon) {
      case 'medic':
      case 'syringe':
      case 'pills':
        this.newRecordForm.value.icon_type = 'custom-icon'
        break
      default:
        this.newRecordForm.value.icon_type = 'ion-icon'
        break
    }
  }

  saveRecord() {
    if (!this.newRecordForm.value.icon){
      this.presentToast('Debes seleccionar un tipo', 'danger')
    }else {
      this.setIconType()
      this.api.createRecord(this.newRecordForm.value).toPromise()
        .then((res: any) => {
          console.log('new record:', res.record);
          this.closeModal(true)
        })
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
  
  async closeModal(reload: boolean) {
    await this.modalController.dismiss({
      reload
    })
  }

}
