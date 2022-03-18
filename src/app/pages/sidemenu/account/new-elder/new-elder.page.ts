import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';

@Component({
  selector: 'app-new-elder',
  templateUrl: './new-elder.page.html',
  styleUrls: ['./new-elder.page.scss'],
})
export class NewElderPage implements OnInit {

  newElderAccountForm: FormGroup
  public passConfirmationWrong = null
  user: User

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.user = this.auth.userData()
    this.newElderAccountForm = this.createNewElderAccountForm()
  }

  createNewElderAccountForm() {
    return this.formBuilder.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      birthdate: [null, Validators.required],
      phone: [null, Validators.required],
      gender: [null, Validators.required],
      rut: ['', Validators.required],
      email: [null],
      password: ['', Validators.required],
      checkPassword: ['', Validators.required],
      image: [null],
      image_ext: [null],
      user_client_id: [this.user.client_id, Validators.required]
    })
  }

  createElderAccount() {
    this.api.createElderAccount(this.newElderAccountForm.value).toPromise()
      .then((res: any) => {
        this.presentToast('Usuario creado', 'success')
        this.user.elders.push(res.newUser)
        this.auth.setUserData(this.user)
        this.closeModal(true);
      })
      .catch(err => {
        this.presentToast('Error al crear usaurio', 'danger')
      })
  }
  
  async closeModal(reload: boolean) {
    await this.modalController.dismiss({
      reload
    })
  }

  // getting the form control elements
  get password(): AbstractControl {
    return this.newElderAccountForm.controls['password'];
  }

  get confirm_password(): AbstractControl {
    return this.newElderAccountForm.controls['checkPassword'];
  }

  // confirm new password validator
  onPasswordChange() {
    if (this.confirm_password.value == this.password.value) {
      this.confirm_password.setErrors({ mismatch: false });
      this.passConfirmationWrong = false;
    } else {
      this.confirm_password.setErrors({ mismatch: true });
      this.passConfirmationWrong = true;
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
