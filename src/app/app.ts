import { Component, OnInit, OnDestroy, ViewChild, ApplicationRef, NgZone } from '@angular/core';
import { FORM_PROVIDERS, FORM_DIRECTIVES } from '@angular/common';

import { Router } from '@ngrx/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/share';

import { Modal } from "./directives/ng2-modal/ng2-modal";

import { LocalJWT } from './services/local-jwt/local-jwt';
import { LoginService } from './services/login-service/login-service';

import '../style/app.scss';

import { Api } from './services/api/api';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app', // <app></app>
  providers: [...FORM_PROVIDERS, Api, LocalJWT, LoginService],
  directives: [...FORM_DIRECTIVES, Modal],
  pipes: [],
  styles: [ require('./app.scss') ],
  template: require('./app.html')
})

export class App implements OnInit, OnDestroy {
  // Observers for Tracking Logins between modules
  static _loggedInObserver;
  static _loggedInObserable = new Observable(observer => {
   App._loggedInObserver = observer; // Assign to static App._loggedInObserver
  }).share();

  static _loggedOutObserver;
  static _loggedOutObserable = new Observable(observer => {
   App._loggedOutObserver = observer; // Assign to static App._loggedOutObserver
  }).share();

  static _forceLoginObserver;
  static _forceLoginObserable = new Observable(observer => {
   App._forceLoginObserver = observer; // Assign to static App._loggedOutObserver
  }).share();

  static _registeredComponents = [1, 2, 3, 6];

  @ViewChild('ModalLogin') ModalLogin;

  // Decoded JWT
  jwtDecoded: any;

  loginModalPromise: Promise<boolean>;
  loginPromise: Promise<boolean>;


  runningLogin = false;

  router: Router;
  jwt: LocalJWT;
  login: LoginService;
  applicationRef: ApplicationRef;
  ngZone: NgZone;


  constructor(
    _jwt: LocalJWT,
    _login: LoginService,
    _applicationRef: ApplicationRef,
    _ngZone: NgZone,
    _router: Router
  ) {
//    console.log('app constructor()');

    //console.log(_router.urlTree);
    this.router = _router;
    this.jwt = _jwt;
    this.login = _login;
    this.ngZone = _ngZone;


    // Must have at least one subscriber, otherwise next() fails
    App._loggedInObserable.subscribe((data) => {
      this.decodeJWT();
    });
    App._loggedOutObserable.subscribe(() => {
      this.jwt.removeJWT();
      this.jwtDecoded = null;
      this.router.go('/login');
    });

    App._forceLoginObserable.subscribe((authGuardObserver: Observer<boolean>) => {
      this.forceLogin(authGuardObserver);
    });
  }

  ngOnInit() {
    App._loggedInObserver.next(true);
  }

  ngOnDestroy() {
    console.log('Destroy');
  }

  ngAfterViewInit() {

//    console.log('app ngAfterViewInit()');
    this.ModalLogin.onOpen.subscribe(_loginPromise => {
      //console.log('Modal Opend', _loginPromise);
      this.loginModalPromise = _loginPromise;
    });
  }

  onModalClose() {
    //console.log('Modal Closed');
    this.loginModalPromise[0](false);
  }

  decodeJWT() {
    this.jwtDecoded = this.jwt.parseJWT(this.jwt.fetchJWT());
  }

  modalLogin(event, user, pass) {
//    console.log("app login", event, user, pass);
    this.login.doLogin(user, pass).subscribe(response => {
      this.loginModalPromise[0](true); // Confirm ModalPromise -> ngrx AuthGuard observable
    });
  }

  logout() {
    App._loggedOutObserver.next(this);
  }


  forceLogin(observer: Observer<boolean>) {
    this.ngZone.run(() => {
      this.loginPromise = new Promise((res) => {
        this.ModalLogin.open(res);
      }).then(
        (ans) => {
          // Dbl check Modal is closed
          try { this.ModalLogin.close(); } catch (e) { ans = false; }

          if (!!ans) {
            // Good Auth
            observer.next(true);
            observer.complete();
            return Promise.resolve(true);
          }

          this.forceLoginError(observer, 'Bad Login');
        },
        (err) => this.forceLoginError(observer, err)
      );
    });
  }

  forceLoginError(observer: Observer<boolean>, err?: any) {
    observer.next(false);
    observer.complete();

    try { this.ModalLogin.close(); } catch (e) { }
    this.router.back();

    return false;
    //return this.forceLogin(observer); // Fail It hard!
  }
}
