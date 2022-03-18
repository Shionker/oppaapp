import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { LocationService } from 'src/app/providers/location/location.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.page.html',
  styleUrls: ['./new-address.page.scss'],
})
export class NewAddressPage implements OnInit {

  newAddressForm: FormGroup
  regions: any[] = []
  districts: string[] = []
  apiUrl: string = environment.HOST + '/'
  @Input() user: User

  constructor(
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private location: LocationService,
    private api: ApiService,
    private auth: AuthService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.newAddressForm = this.createNewAddressForm()
    this.location.getDistricts().toPromise()
      .then((districts) => {
        this.districts = districts
      })
      .catch((err) => {
        console.log(err)
      })
    this.location.getRegions().toPromise()
      .then((regions) => {
        this.regions = regions
      })
      .catch((err) => {
        console.log(err)
      })
  }

  getDistrictsByRegion() {
    if (!!this.newAddressForm.value.region) {
      this.newAddressForm.controls.district.reset()
      this.location.getDistrictsByRegion(this.regions.find(region => region.nombre === this.newAddressForm.value.region)?.codigo).toPromise()
        .then((districts: any) => {
          this.districts = districts
        })
        .catch((err) => {
          console.log(err)
        })
    }
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

  saveAddress() {
    if (this.newAddressForm.valid) {
      this.api.saveNewAddress(this.newAddressForm.value).toPromise()
        .then((res: any) => {
          this.newAddressForm.reset()
          this.closeModal(true, res.userAddresses)
        })
        .catch(err => {
          this.presentToast('Error al guardar nueva dirección', 'danger');
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

  async closeModal(reload: boolean, receptorAddresses) {
    if (!reload) {
      await this.modalController.dismiss()
    } else {
      await this.modalController.dismiss({
        reload,
        receptorAddresses
      })
    }
  }

}
