import { Component, OnInit } from '@angular/core';
import * as faker from 'faker/locale/es_MX'

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  contact = {
    phone: faker.phone.phoneNumber(),
    email: faker.internet.email()
  }

  constructor() { }

  ngOnInit() {
  }

}
