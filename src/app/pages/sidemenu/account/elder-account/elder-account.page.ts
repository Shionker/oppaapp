import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { LocationService } from 'src/app/providers/location/location.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-elder-account',
  templateUrl: './elder-account.page.html',
  styleUrls: ['./elder-account.page.scss'],
})
export class ElderAccountPage implements OnInit {

  
  @Input() public elder: User
  @Input() public index: number
  user: User
  user_img: string;
  userDataForm: FormGroup
  newAddressForm: FormGroup
  isEditing: boolean = false
  apiUrl: string = environment.HOST + '/'
  isAddingAnAddress: boolean = false
  regions: any[] = []
  districts: string[] = []


  constructor(
    private api: ApiService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private dateFormat: DatePipe,
    private toastCtrl: ToastController,
    private location: LocationService,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    console.log(this.elder, this.index)
    this.user = this.auth.userData()
    this.userDataForm = this.createUserDataForm()
    this.newAddressForm = this.createNewAddressForm()
    this.location.getDistricts().toPromise()
      .then((districts) => {
        this.districts = districts
      })
    this.location.getRegions().toPromise()
      .then((regions) => {
        this.regions = regions
      })
  }

  getDistrictsByRegion(){
    this.newAddressForm.controls.district.reset()
    this.location.getDistrictsByRegion(this.regions.find(region => region.nombre === this.newAddressForm.value.region)?.codigo).toPromise()
      .then((districts: any) => {
        this.districts = districts
      })
  }

  createUserDataForm() {
    return this.formBuilder.group({
      user_id: [this.elder.user_id, Validators.required],
      firstname: [this.elder.firstname, Validators.required],
      lastname: [this.elder.lastname, Validators.required],
      gender: [this.elder.gender, Validators.required],
      birthdate: [this.dateFormat.transform(this.elder.birthdate, 'dd-MM-yyyy'), Validators.required],
      phone: [this.elder.phone, Validators.required],
      image_ext: [''],
      image: [null]
    })
  }

  createNewAddressForm() {
    return this.formBuilder.group({
      users_user_id: [this.elder.user_id, Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      other: [null],
      district: ['', Validators.required],
      region: ['', Validators.required],
    })
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.userDataForm.value.image = imageData;
      this.user_img = imageData;
      switch(imageData.charAt(0)) {
        case '/':
          this.userDataForm.value.image_ext = 'jpg'
        break
        case 'i':
          this.userDataForm.value.image_ext = 'png'
        break
        case 'R':
          this.userDataForm.value.image_ext = 'gif'
        break
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Seleccionar imagen desde",
      buttons: [{
        text: 'Memoria',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Tomar foto',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
  
  saveData() {
    this.api.editUser(this.userDataForm.value).toPromise()
      .then((res: any) => {
        this.elder = res.user; 
        this.presentToast('Datos actualizados.', 'success')
      })
  }

  addAddress() {
    this.isAddingAnAddress = true
  }
  
  saveAddress() {
    this.api.saveNewAddress(this.newAddressForm.value).toPromise()
      .then((res: any) => {
        this.isAddingAnAddress = false
        this.newAddressForm.reset()
        this.elder.addresses = res.userAddresses
        this.user.elders[this.index] = this.elder
        this.auth.setUserData(this.user)
      })
      .catch(err => {
        this.presentToast('Error al guardar nueva dirección', 'danger');
      })
  }

  cancelNewAddress() {
    this.isAddingAnAddress = false
    this.newAddressForm.reset()
  }

  async deleteAddress(address, index) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: '¿Desea eliminar la siguiente dirección?',
      message: address.street + ', ' + (address.other ? address.other + ', ':'') + address.district + ', región ' + address.region + '.',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Direccion no eliminada');
          // no borrar dirección
        }
      }, {
        text: 'Eliminar',
        handler: () => {
          console.log('Eliminando dirección');
          alert.onDidDismiss().then(async () => {
            this.api.deleteAddress(address.address_id).toPromise()
              .then((res: any) => {
                console.log('Dirección eliminada');
                this.elder.addresses = res.userAddresses
                this.user.elders[this.index] = this.elder
                this.auth.setUserData(this.user)
              })
          })
        }
      }]
    });

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
  
  async closeModal(reload: boolean) {
    await this.modalController.dismiss({
      reload
    })
  }

}
