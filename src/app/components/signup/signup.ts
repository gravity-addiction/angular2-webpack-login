import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router-deprecated';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {LoginService} from '../../services/login-service/login-service';
import {LocalJWT} from '../../services/local-jwt/local-jwt';

@Component({
  selector: 'signup',
  template: require('./signup.html'),
  styles: [require('./signup.css')],
  providers: [],
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
  pipes: []
})

export class Signup {
  router: Router;
  jwt: LocalJWT;
  login: LoginService;

  constructor(
    _router: Router,
    _jwt: LocalJWT,
    _login: LoginService
  ) {
    this.router = _router;
    this.jwt = _jwt;
    this.login = _login;
  }

  signup(event, username, password, email, fullname) {
    event.preventDefault();

    this.login.doSignup(username, password, email, fullname)
    .subscribe(
      resp => null,
      error => null,
      () => {
        //Go Home!
        this.router.navigate(['Home']);
      }
    );


  }

}
