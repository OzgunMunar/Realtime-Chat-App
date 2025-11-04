import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterModel } from '../../models/register.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export default class Register {

  registerModel: RegisterModel = new RegisterModel()

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  register() {

    this.http.post("https://localhost:7016/api/Auth/Register", this.registerModel)
      .subscribe(res => {

        localStorage.setItem("accessToken", JSON.stringify(res))
        this.router.navigateByUrl("/")

      })

  }

}
