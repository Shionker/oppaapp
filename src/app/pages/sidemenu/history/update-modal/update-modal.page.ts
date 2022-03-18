import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Service } from 'src/app/models/service';
import { ApiService } from 'src/app/providers/api/api.service';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.page.html',
  styleUrls: ['./update-modal.page.scss'],
})
export class UpdateModalPage implements OnInit {

  updateServiceForm: FormGroup

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dateFormat: DatePipe
  ) { }

  @Input() public service: Service

  ngOnInit() {
    this.updateServiceForm = this.createUpdateServiceForm()
    console.table(this.service)
  }

  async closeModal() {
    await this.modalController.dismiss()
  }

  createUpdateServiceForm() {
    return this.formBuilder.group({
      date: [this.dateFormat.transform(this.service.date, 'dd-MM-yyyy')],
      type: [this.service.type],
      description: [this.service.description],
      providerName: [this.service.serverName],
      state: [this.service.state],
    })
  }

}
