import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, signal } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { ChatModel } from '../../models/chat.model';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export default class Home {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    this.user = JSON.parse(localStorage.getItem("accessToken") ?? "")
    this.getUsers()

    this.hub = new signalR
      .HubConnectionBuilder()
      .withUrl("https://localhost:7016/chat-hub")
      .build()

    this.hub
      .start()
      .then(() => {

        console.log("Chat Hub Connected.")
        this.hub?.invoke("Connect", this.user.id)

        this.hub?.on("Users", (res: UserModel) => {

          this.users().find(p => p.id == res.id)!.status = res.status

        })

        this.hub?.on("Messages", (res: ChatModel) => {

          if (this.selectedUserId == res.userId) {

            this.chats.set([...this.chats(), res])

          }

        })

      })

  }

  @HostListener('window:beforeunload', ['$event']) handleBeforeUnload(event: BeforeUnloadEvent) {

    if (!performance.getEntriesByType("navigation").some((e: any) => e.type === "reload")) {
      
      this.hub?.stop();

    }
    
  }

  users = signal<UserModel[]>([])
  chats = signal<ChatModel[]>([])
  selectedUserId: string = "";
  selectedUser: UserModel = new UserModel()
  user = new UserModel()
  hub: signalR.HubConnection | undefined
  message: string = ""


  getUsers() {

    this.http.get<UserModel[]>("https://localhost:7016/api/Chat/GetUsers")
      .subscribe(res => {
        this.users.set(res.filter(u => u.id != this.user.id))
      })

  }

  changeUser(user: UserModel) {

    this.selectedUserId = user.id;
    this.selectedUser = user;

    this.http.get<ChatModel[]>(`https://localhost:7016/api/Chat/GetChats?userId=${this.user.id}&toUserId=${this.selectedUserId}`)
      .subscribe(res => {
        this.chats.set(res)
      })

  }

  logout() {

    this.hub?.stop()
      .then(() => {

        console.log("Hub connection stopped.");
        localStorage.clear();
        this.router.navigateByUrl("/login");

      })
  }

  sendMessage() {

    const data = {

      "userId": this.user.id,
      "toUserId": this.selectedUserId,
      "message": this.message

    }

    this.http.post<ChatModel>(`https://localhost:7016/api/Chat/SendMessage`, data)
      .subscribe(res => {

        this.chats.set([...this.chats(), res])
        this.message = ""

      })

  }

}