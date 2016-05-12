import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';

import { LoginService } from "../../services/login-service/login-service";

@Component({
  selector: 'login',
  template: require('./login.html'),
  styles: [ require('./login.css') ],
  providers: [],
  directives: [ ...ROUTER_DIRECTIVES, ...CORE_DIRECTIVES, ...FORM_DIRECTIVES ],
  pipes: []
})
export class Login {
  login: LoginService;
  router: Router;

  constructor(_login: LoginService, _router: Router) {
    this.router = _router;
    this.login = _login;
  }

  doLogin(event, user, pass) {
    event.preventDefault();
    this.login.doLogin(user, pass)
    .subscribe(
      resp => {
        this.router.navigateByUrl('/');
      }
    );
  }
}
