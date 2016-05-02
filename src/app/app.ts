import {Component, OnInit, ViewChild, ApplicationRef} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS, FORM_DIRECTIVES} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import {Modal} from "ng2-modal/Modal";

import {LoggedInOutlet} from './directives/logged-in-outlet/logged-in-outlet';
import {LocalJWT} from './services/local-jwt/local-jwt';
import {LoginService} from './services/login-service/login-service';

import '../style/app.scss';

import {Api} from './services/api/api';
import {Home} from './components/home/home';
import {About} from "./components/about/about";
import {Login} from "./components/login/login";
import {Signup} from "./components/signup/signup";

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app', // <app></app>
  providers: [...FORM_PROVIDERS, Api, LocalJWT, LoginService],
  directives: [...FORM_DIRECTIVES, ...ROUTER_DIRECTIVES, LoggedInOutlet, Modal],
  pipes: [],
  styles: [require('./app.scss')],
  template: require('./app.html')
})
@RouteConfig([
  {path: '/', component: Home, name: 'Home'},
  {path: '/about', component: About, name: 'About'},
  {path: '/login', component: Login, name: 'Login'},
  {path: '/signup', component: Signup, name: 'Signup'}
])

export class App implements OnInit {
  // Observers for Tracking Logins between modules
  static _loggedInObserver;
  static _loggedInObserable = new Observable(observer => {
   App._loggedInObserver = observer; // Assign to static App._loggedInObserver
  }).share();

  static _loggedOutObserver;
  static _loggedOutObserable = new Observable(observer => {
   App._loggedOutObserver = observer; // Assign to static App._loggedOutObserver
  }).share();

  static _registeredComponents = [1, 2, 3, 6];

  @ViewChild('ModalLogin') ModalLogin;

  // Decoded JWT
  jwtDecoded: any;

  loginPromise: Promise<boolean>; // </boolean>

  runningLogin: boolean = false;

  router: Router;
  jwt: LocalJWT;
  login: LoginService;
  applicationRef: ApplicationRef;

  constructor(
    _router: Router,
    _jwt: LocalJWT,
    _login: LoginService,
    _applicationRef: ApplicationRef
  ) {
//    console.log('app constructor()');

    this.router = _router;
    this.jwt = _jwt;
    this.login = _login;


// Dirty Workaround for Safari / IE Back button Rendering issues
    this.applicationRef = _applicationRef;
    this.router.subscribe(() => {
      this.applicationRef.tick();
      setTimeout(() => {
        this.applicationRef.tick();
      }, 100);
    });
// End Workaround

    // Must have at least one subscriber, otherwise next() fails
    App._loggedInObserable.subscribe((data) => {
      this.decodeJWT();
    });
    App._loggedOutObserable.subscribe(this.logout);
  }

  ngOnInit() {
    App._loggedInObserver.next(true);
  }

  ngAfterViewInit() {
//    console.log('app ngAfterViewInit()');
    this.ModalLogin.onOpen.subscribe(_loginPromise => {
      console.log('Modal Opend', _loginPromise);
      this.loginPromise = _loginPromise;
    });
  }

  onModalClose() {
    console.log('Modal Closed', this.loginPromise);
    try {
      this.loginPromise[1]('Closed Modal');
    } catch(e) {
      console.log('Cant Promise Login!');
    }
  }

  decodeJWT() {
    this.jwtDecoded = this.jwt.parseJWT(this.jwt.fetchJWT());
  }

  modalLogin(event, user, pass) {
//    console.log("app login", event, user, pass);
    this.login.doLogin(user, pass).subscribe(response => {
      this.loginPromise[0](true); // Confirm Login for Angular CanActivate / CanDeactivate
//      console.log('app Modal Response', response);
    });
  }

  logout() {
    this.jwt.removeJWT();
    this.jwtDecoded = null;
    this.router.navigateByUrl('/login');
  }
}
