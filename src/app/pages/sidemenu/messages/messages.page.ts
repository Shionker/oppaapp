import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MessageList } from 'src/app/models/message-list';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/providers/api/api.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { WebSocketService } from 'src/app/providers/web-socket/web-socket.service';
import { environment } from 'src/environments/environment';
import { ChatPage } from './chat/chat.page';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  $messages: Observable<MessageList[]>
  user: User
  apiUrl: string = environment.HOST + '/'
  
  constructor(
    private api: ApiService,
    private auth: AuthService,
    protected ws: WebSocketService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.user = this.auth.userData()
    this.$messages = this.api.getChatList(this.user.user_id)
    this.ws.listen('notificateUser').subscribe((data: any) => { 
      //cuando llega una notificación, hace lo siguiente
      this.$messages = this.api.getChatList(this.user.user_id)
    })
  }

  async openModal(chat: MessageList) {
    const modal = await this.modalController.create({
      component: ChatPage,
      componentProps: {
        chat
      }
    })
    return await modal.present()
  }

}
