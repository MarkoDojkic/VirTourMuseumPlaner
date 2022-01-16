import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/model/message';
import { ChatService } from 'src/app/services/chat/chat.service';
import { VisitorService } from 'src/app/services/visitor/visitor.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: Array<Message> = [];

  constructor(private visitorService: VisitorService, private chatService: ChatService) { }

  ngOnInit(): void { }

  sendMessage(event: any) {
    this.visitorService.getLoggedInVisitor().then(response => {
      this.messages.push({
        text: event.message,
        date: new Date(),
        reply: true,
        type: 'text',
        user: {
          name: response.name + " " + response.surname,
          avatar: '../../assets/images/visitor.png'
        },
      });
    });

    this.chatService.reply(event.message).then(response => this.messages.push({
      text: response,
      date: new Date(),
      reply: true,
      type: 'text',
      user: {
        name: 'VirTourMuseumPlanerBot',
        avatar: '../../assets/images/bot.png'
      },
    }));
  }
}
