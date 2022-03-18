import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {

  @Input() orderBy: string
  @Input() mode: string

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }


  selectOrderBy(orderBy: string) {
    this.orderBy = orderBy
  }
  
  async closeModal() {
    await this.modalController.dismiss({
      filter: this.orderBy
    })
  }

}
