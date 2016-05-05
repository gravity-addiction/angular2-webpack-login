import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {App} from '../../app';
import {LocalJWT} from '../../services/local-jwt/local-jwt';

@Injectable()
export class LoginService {
  http: Http;
  jwt: LocalJWT;
  runningLogin: boolean = false;

  constructor(
    _http: Http,
    _jwt: LocalJWT
  ) {
    this.http = _http;
    this.jwt = _jwt;
  }

  doLogin(username: string, password: string) {
    if (this.runningLogin) { return; }
    this.runningLogin = true;

    let contentHeaders = new Headers();
    contentHeaders.append('Accept', 'application/json');
    contentHeaders.append('Content-Type', 'application/json');

    let sessCreate = this.http.post('http://localhost:3000/sessions/create', JSON.stringify({username, password}), {headers: contentHeaders}).share();

    sessCreate.subscribe(
      response => {
        this.jwt.saveJWT(response.json().id_token);

        App._loggedInObserver.next(true);

        this.runningLogin = false;
        // TODO: Check if at Login Page /login or /signup to forward
        //this._router.navigate(['Home']);
      },
      error => {
        this.runningLogin = false;
        alert(error.text());
      }
    );

    return sessCreate;
  }

  doSignup(username: string, password: string, email: string, fullname: string) {
    // HTTP call to backend server
    let contentHeaders = new Headers();
    contentHeaders.append('Accept', 'application/json');
    contentHeaders.append('Content-Type', 'application/json');

    let sessSignup = this.http.post('http://localhost:3000/users/create', JSON.stringify({username, password, email, fullname}), {headers: contentHeaders}).share();

    sessSignup.subscribe(
      response => {
        this.jwt.saveJWT(response.json().id_token);
        App._loggedInObserver.next(true);
      },
      error => {
        alert(error.text());
      }
    );
    return sessSignup;
  }

}
