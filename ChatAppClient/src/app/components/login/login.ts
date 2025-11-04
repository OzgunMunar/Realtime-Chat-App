import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export default class Login {

  name = signal<string>("")

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login() {

    this.http.post(`https://localhost:7016/api/Auth/Login?name=${this.name()}`,{})
      .subscribe(res => {
        
        localStorage.setItem("accessToken", JSON.stringify(res))
        this.router.navigateByUrl("/")

      })

  }

}
