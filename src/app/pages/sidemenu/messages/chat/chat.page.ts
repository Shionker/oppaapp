import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/providers/auth/auth.service';

import { WebSocketService } from 'src/app/providers/web-socket/web-socket.service';
import { MessageList } from 'src/app/models/message-list';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/providers/api/api.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  darkMode: boolean
  messageForm: FormGroup
  user: User;
  public serverMessages = new Array<Message>();
  wsConnectionState: string;
  apiUrl: string = environment.HOST + '/'
  @ViewChild('content') private content: any;
  @ViewChild('textarea') textarea
  @Input() public chat: MessageList

  constructor(
    protected ws: WebSocketService,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.user = this.auth.userData();
    this.darkMode = (localStorage.getItem('darkMode') == 'on') ? true : false;
    this.messageForm = this.createMesageForm();
    this.api.getChatMessages(this.chat.chat_id).toPromise()
      .then((res: any) => {
        this.serverMessages = res.chatMessages
        this.scrollToBottom();
      })
  }

  ionViewDidEnter() {

    console.log('ionViewDidEnter');

    // We connect to the server
    this.ws.connect()

    // Tell the server which room I want to connect to
    this.ws.emit('connectToChat', {
      chat: this.chat.chat_id
    });

    // whatever the room I'm connected to, listen to the 'message' socket
    this.ws.listen('message').subscribe((message: Message) => {
      console.log('Message received:', message);
      this.serverMessages.push(message);
      this.scrollToBottom();
    });

  }

  createMesageForm() {
    return this.formBuilder.group({
      message: [null]
    });
  }

  sendMessage() {
    this.textarea.setFocus();
    if (this.messageForm.value.message !== null) {
      const message = {
        text: this.messageForm.value.message,
        url: null,
        type: 'text',
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        chats_chat_id: this.chat.chat_id,
        users_user_id: this.user.user_id,
        firstname: this.user.firstname,
        lastname: this.user.lastname
      }
      console.log('sending message', message);
      this.serverMessages.push(message)
      this.ws.emit('message', message)
      this.messageForm.reset();
      this.scrollToBottom();
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
    this.ws.close();
  }

  scrollToBottom() {
    setTimeout(() => {
      console.log('scrolling...');
      this.content.scrollToBottom(300);
    }, 100);
  }

}
