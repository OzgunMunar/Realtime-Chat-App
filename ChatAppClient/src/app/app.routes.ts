import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from './auth';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("../app/components/home/home"),
        canActivate: [() => inject(AuthService)]
    },
    {
        path: "login",
        loadComponent: () => import("../app/components/login/login")
    },
    {
        path: "register",
        loadComponent: () => import("../app/components/register/register")
    }
];
