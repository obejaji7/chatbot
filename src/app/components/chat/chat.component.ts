import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatService } from 'src/app/services/chat/chat.service';
import { User } from 'src/app/interfaces/User';
import { Message } from 'src/app/interfaces/IMessage';
import { Command } from 'src/app/interfaces/Command';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

enum Processes {
  Connect = 1,
  SendMessage,
  LoadUsers,
  DeleteUser
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  form: FormGroup;
  user: User = new User();
  messages: Message[] = [];
  userColor: string;
  users: User[];
  subscriptions: Subscription[] = [];
  currentProcess: Processes;

  constructor(
    private chatService: ChatService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = fb.group({
      message: [null, Validators.compose([Validators.required])]
    });

    chatService.messages.subscribe(response => {
      if (response.Type === 'Message') {
        this.messages.push(response.Message as Message);
      } else if (response.Type === 'Users') {
        this.users = response.Users as User[];
      } else if (response.Type === 'User') {
        this.users.push(response.User as User);
      } else if (response.Type === 'Socketid') {
        localStorage.setItem('Socketid', response.Socket);
      } else if (response.Type === 'Bot') {
        const message: Message = new Message();
        message.Username = 'Mr. Bot';
        message.Content = response.Message;
        message.Color = 'Black';
        this.messages.push(message);
      }
    });
  }

  submit() {
    if (this.form.valid) {
      const content: string = this.form.controls.message.value;
      if (content.search('/stock=') !== -1) {
        const command = new Command();
        const symbol = content.split('=')[1];
        if (symbol) {
          command.Code = symbol;
          command.Socketid = localStorage.getItem('Socketid');

          this.chatService.sendCommand(command);
        }
      } else {
        this.currentProcess = Processes.SendMessage;
        const message: Message = new Message();
        message.Username = this.user.username;
        message.Content = this.form.controls.message.value;
        message.Color = this.userColor;
        this.chatService.sendMessage(message);
      }
    }
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.subscriptions.push(
      this.authService
        .getUsers()
        .subscribe((users: User[]) => (this.users = users))
    );
    this.subscriptions.push(
      this.chatService
        .getMessages()
        .subscribe((messages: Message[]) => (this.messages = messages))
    );
    this.userColor = this.setUserColor();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setUserColor() {
    const number = Math.floor(Math.random() * 10);
    const colors = {
      0: 'red',
      1: 'green',
      2: 'blue',
      3: 'gray',
      4: 'purple',
      5: 'black',
      6: 'cyan',
      7: 'pink',
      8: 'yellow',
      9: 'orange'
    };
    return colors[number];
  }
}
