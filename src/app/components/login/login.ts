import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router-deprecated';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';

import {LoginService} from "../../services/login-service/login-service";

@Component({
  selector: 'login',
  template: require('./login.html'),
  styles: [require('./login.css')],
  providers: [],
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
  pipes: []
})
export class Login {
  login: LoginService;
  router: Router;

  constructor(_login: LoginService, _router: Router) {
    this.login = _login;
    this.router = _router;
  }

  doLogin(event, user, pass) {
    event.preventDefault();
    this.login.doLogin(user, pass)
    .subscribe(
      resp => {
        this.router.navigate(['Home']);
      }
    );
  }
}
