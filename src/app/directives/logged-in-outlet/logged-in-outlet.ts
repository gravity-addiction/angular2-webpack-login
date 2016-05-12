import { Directive, Attribute, ViewContainerRef, ComponentFactory, ComponentRef, ResolvedReflectiveProvider, Input } from '@angular/core';
import { Location } from '@angular/common';
import { RouterOutletMap, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router/src/directives/router_outlet';
import { LocalJWT } from '../../services/local-jwt/local-jwt';
import { tokenNotExpired } from 'angular2-jwt';

@Directive({
  selector: 'router-outlet',

})

export class LoggedInOutlet extends RouterOutlet {
  @Input() ModalLogin;

  router: Router;
  loc: Location;
  publicRoutes: any;
  location: ViewContainerRef;

  private jwt: LocalJWT;
  private loginPromise: any;



  constructor(parentOutletMap: RouterOutletMap, _location: ViewContainerRef,
              @Attribute('name') name: string, _jwt: LocalJWT, _router: Router, _loc: Location ) {

    super(parentOutletMap, _location, name);

    this.router = _router;
    this.jwt = _jwt;
    this.loc = _loc;

    this.publicRoutes = {
      '': true,
      'login': true,
      'signup': true,
      'home': true
    };

  }

  load(factory: ComponentFactory<any>, providers: ResolvedReflectiveProvider[],
           outletMap: RouterOutletMap): ComponentRef<any> {

    let jwt = localStorage.getItem('jwt');
    if (!this.publicRoutes[factory.selector] && (!jwt || !tokenNotExpired('jwt'))) {
      return this.forceLogin(factory, providers, outletMap);
    }

    return super.load(factory, providers, outletMap);
  }

  forceLogin(factory: ComponentFactory<any>, providers: ResolvedReflectiveProvider[],
           outletMap: RouterOutletMap) {
    if (!!this.loginPromise) { return this.loginPromise; }

    this.loginPromise = new Promise((resolve, reject) => {
      this.ModalLogin.open(resolve, reject);
    }).then(
      (ans) => {
        this.ModalLogin.close();
        this.loginPromise = null;

        if (!!ans) { // Good Reply
          return super.load(factory, providers, outletMap);
        }
        return this.forceLogin(factory, providers, outletMap);
      },
      (error) => {

        this.loginPromise = null;

        return false;
      }
    );

    return this.loginPromise;
  }
}
