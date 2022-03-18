import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  public createAccountForm: FormGroup

  img_base64 = "";
  user_img: string;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 100
  };

  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private api: ApiService,
    private loadingController: LoadingController,
    private toastCtrl: ToastController,
    private auth: AuthService,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public router: Router, // para enviar al usuario a otra vista
  ) { }

  ngOnInit() {
    this.createAccountForm = this.createCreateAccountForm()
  }

  createCreateAccountForm() {
    return this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      birthdate: ['', Validators.required],
      gender: ['', Validators.required],
      rut: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      checkPassword: ['', Validators.required],
      image_ext: [''],
      image: ['']
    })
  }

  // confirm new password validator
  onPasswordChange() {
    if (this.confirm_password.value == this.password.value) {
      this.confirm_password.setErrors(null);
    } else {
      this.confirm_password.setErrors({ mismatch: true });
    }
  }

  // getting the form control elements
  get password(): AbstractControl {
    return this.createAccountForm.controls['password'];
  }

  get confirm_password(): AbstractControl {
    return this.createAccountForm.controls['checkPassword'];
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
      this.createAccountForm.value.image = imageData;
      this.user_img = imageData;
      switch(imageData.charAt(0)) {
        case '/':
          this.createAccountForm.value.image_ext = 'jpg'
        break
        case 'i':
          this.createAccountForm.value.image_ext = 'png'
        break
        case 'R':
          this.createAccountForm.value.image_ext = 'gif'
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

  async createAccount() {
    if(this.createAccountForm.valid){
      const loading = await this.loadingController.create({
        message: 'Creando usuario...'
      });
      await loading.present()
      this.api.createAccount(this.createAccountForm.value).toPromise()
        .then(userData => {
          loading.dismiss()
          this.ngZone.run(() => {
            this.presentToast('Cuenta creada correctamente', 'success');
            this.router.navigate(['/login']);
            loading.dismiss()
          }, err => {
            console.log(err);
            loading.dismiss()
            this.presentToast('No se ha podido crear la cuenta', 'danger');
          });
          /* this.auth.login({
            email: userData.email,
            password: this.createAccountForm.value.password
          }) */
        })
        .catch(err => {
          loading.dismiss()
          if (err.error.message === 'Duplicate entry') {
            this.presentToast('El RUT y/o EMAIL ya está registrado', 'danger');
          } else {
            this.presentToast('No se ha podido crear la cuenta', 'danger');
          }
          console.log(err.error.message);
        });
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
