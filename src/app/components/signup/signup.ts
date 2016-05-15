import { Component } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import { LoginService } from '../../services/login-service/login-service';
import { LocalJWT } from '../../services/local-jwt/local-jwt';

@Component({
  selector: 'signup',
  template: require('./signup.html'),
  styles: [ require('./signup.css') ],
  providers: [],
  directives: [ ...CORE_DIRECTIVES, ...FORM_DIRECTIVES ],
  pipes: []
})

export class Signup {
  jwt: LocalJWT;
  login: LoginService;

  constructor(
    _jwt: LocalJWT,
    _login: LoginService
  ) {
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
        // Fix
        // this.router.navigateByUrl('/');
      }
    );


  }

}
