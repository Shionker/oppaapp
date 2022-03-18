import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { LocationService } from 'src/app/providers/location/location.service';
import { environment } from 'src/environments/environment';
import { NewElderPage } from './new-elder/new-elder.page';
//import { CameraOptions, Camera } from '@ionic-native/Camera/ngx';
import { ElderAccountPage } from './elder-account/elder-account.page';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { async } from '@angular/core/testing';
import { Directory, Filesystem } from '@capacitor/filesystem'
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
//import { resolve } from 'dns';

const IMAGE_DIR = 'stored-images';

interface LocalFile{
  name: string;
  path: string;
  data: string;
}
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  btnImageText: string = 'seleccionar imagen';
  user_img2: FormGroup;
  //d
  images: LocalFile[] = [];
  //d
  user: User;
  user_img: string;
  userDataForm: FormGroup;
  newAddressForm: FormGroup;
  isEditing: boolean = false;
  apiUrl: string = environment.HOST + '/';
  isAddingAnAddress: boolean = false;
  regions: any[] = [];
  districts: string[] = [];
  isAddingAnImage: boolean = false;


  constructor(

    //c
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    //c

    private api: ApiService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private dateFormat: DatePipe,
    private toastCtrl: ToastController,
    private location: LocationService,
    public actionSheetController: ActionSheetController,
    //private camera: Camera,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    this.user = this.auth.userData()
    this.userDataForm = this.createUserDataForm()
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

    //f
    this.loadFiles();
    //f
  }

  //e
  async loadFiles(){
    this.images = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading data...'
    });
    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR,
    }).then(result => {
      console.log('HERE: ',result);
      this.loadFileData(result.files);

    }, async err => {
      console.log('err: ',err);
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR,
      })
    }).then(_ =>{
      loading.dismiss();
    })
  }

  async loadFileData(fileNames: string[]){
    for (let f of fileNames){
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      });

      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      });
      console.log('READ: ',readFile);
    }
  }
  //e

  getDistrictsByRegion() {
    this.newAddressForm.controls.district.reset()
    this.location.getDistrictsByRegion(this.regions.find(region => region.nombre === this.newAddressForm.value.region)?.codigo).toPromise()
      .then((districts: any) => {
        this.districts = districts
      })
      .catch((err) => {
        console.log(err)
      })
  }

  createUserDataForm() {
    return this.formBuilder.group({
      user_id: [this.user.user_id, Validators.required],
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      gender: [this.user.gender, Validators.required],
      birthdate: [this.dateFormat.transform(this.user.birthdate, 'dd-MM-yyyy'), Validators.required],
      phone: [this.user.phone, Validators.required],
      image_ext: [''],
      image: [null]
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

/*
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
      switch (imageData.charAt(0)) {
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
*/



    //a


/*
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
    await actionSheet.present()
*/


  /*/b
  }
  async saveImage(photo: Photo){
    const base64Data = await this.readAsBase64(photo);
    console.log(base64Data)

    const fileName = new Date().getTime()+'.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data
    });
    console.log('saved: ', savedFile);
    this.loadFiles();
  }

  async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path
      });

      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  //Helper function
  convertBlobToBase64 = (blob: Blob) => new Promise ((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
*/
  
  //b

  saveData() {
    this.api.editUser(this.userDataForm.value).toPromise()
      .then((res: any) => {
        this.user = res.user;
        this.auth.setUserData(this.user);
        this.presentToast('Datos actualizados.', 'success')
      })
  }

  addAddress() {
    this.isAddingAnAddress = true
  }

  addImage() {
    this.isAddingAnImage = true
  }

  saveImage() {
    if (this.userDataForm.value.image) {
      this.api.editUser(this.userDataForm.value.image).toPromise()
      .then((res: any)=>{
        this.isAddingAnImage = true
        this.userDataForm.reset()
        this.user.avatar = res.image
        this.auth.setUserData(this.user)
      })
      .catch(err => {
        this.presentToast('Error al guardar nueva imagen', 'danger');
      })
  }
}

  saveAddress() {
    if (this.newAddressForm.valid) {
      this.api.saveNewAddress(this.newAddressForm.value).toPromise()
        .then((res: any) => {
          this.isAddingAnAddress = false
          this.newAddressForm.reset()
          this.user.addresses = res.userAddresses
          this.auth.setUserData(this.user)
        })
        .catch(err => {
          this.presentToast('Error al guardar nueva dirección', 'danger');
        })
    }
  }

  cancelNewAddress() {
    this.isAddingAnAddress = false
    this.newAddressForm.reset()
  }

  async deleteAddress(address, index) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: '¿Desea eliminar la siguiente dirección?',
      message: address.street + ', ' + (address.other ? address.other + ', ' : '') + address.district + ', región ' + address.region + '.',
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
                this.user.addresses = res.userAddresses
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

  async createElderAccount() {
    const modal = await this.modalController.create({
      component: NewElderPage
    })

    modal.onDidDismiss()
      .then((res: any) => {
        if (res.data.reload) this.user = this.auth.userData()
      })

    return await modal.present()
  }

  async editElderAccount(elder: User, index: number) {
    const modal = await this.modalController.create({
      component: ElderAccountPage,
      componentProps: {
        elder,
        index
      }
    })

    modal.onDidDismiss()
      .then((res: any) => {
        if (res.data.reload) this.user = this.auth.userData()
      })

    return await modal.present()
  }

  //g
  async startUpload(file: LocalFile){
    const response = await fetch(file.data);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, file.name)
    this.uploadData(formData);
  }

  async uploadData(formData: FormData){
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
    });
    await loading.present();

    //Usar API propia
    const url = 'http://api.somosoppa.cl:22/home/oppa/images/upload.php'

    this.http.post(url, formData).pipe(
      finalize(() => {
        loading.dismiss();
      })
    ).subscribe(res => {
      console.log(res)
    })
  }

  async deleteImage(file: LocalFile){
  await Filesystem.deleteFile({
    directory: Directory.Data,
    path: file.path
  });
  this.loadFiles();
  }
  //g

  imageSelected($event) {
    console.log($event);
    this.btnImageText = $event.srcElement.files[0].name
    this.userDataForm.value.image = $event.srcElement.files[0]
  }
}
