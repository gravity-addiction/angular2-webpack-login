import {Directive, Attribute, ViewContainerRef, DynamicComponentLoader, Input} from '@angular/core';
import {Router, RouterOutlet, ComponentInstruction} from '@angular/router-deprecated';
import {LocalJWT} from '../../services/local-jwt/local-jwt';
import {tokenNotExpired} from 'angular2-jwt';

@Directive({
  selector: 'auth-router-outlet',

})

export class LoggedInOutlet extends RouterOutlet {
  @Input() ModalLogin;

  publicRoutes: any;
  private parentRouter: Router;
  private jwt: LocalJWT;

  private loginPromise: any;

  constructor(
    _elementRef: ViewContainerRef,
    _loader: DynamicComponentLoader,
    _parentRouter: Router,
    _jwt: LocalJWT,
    @Attribute('name') nameAttr: string) {
    super(_elementRef, _loader, _parentRouter, nameAttr);

    this.jwt = _jwt;
    this.parentRouter = _parentRouter;
    this.publicRoutes = {
      '': true,
      'login': true,
      'signup': true,
      'home': true
    };

  }

  activate(instruction: ComponentInstruction) {
    let url = instruction.urlPath;
    let jwt = localStorage.getItem('jwt');
    if (!this.publicRoutes[url] && !jwt) {
      return this.forceLogin();
    }

    return super.activate(instruction);
  }

  reuse(instruction: ComponentInstruction) {
//    console.log('Doing Reuse');
    let url = instruction.urlPath;

    let jwt = localStorage.getItem('jwt');
    if (!this.publicRoutes[url] && !jwt) {
//      console.log('No Token Exists');
      return this.forceLogin();
    } else if (!this.publicRoutes[url] && !tokenNotExpired('jwt')) {
//      console.log('Token Expired');
      return this.forceLogin();
    }

    return super.reuse(instruction);
  }

  routerCanDeactivate(instruction: ComponentInstruction) {
//    console.log('Doing Deactivate', instruction);
    let url = instruction.urlPath;

    let jwt = localStorage.getItem('jwt');
    if (!this.publicRoutes[url] && !jwt) {
      return this.forceLogin();
    } else if (!this.publicRoutes[url] && !tokenNotExpired('jwt')) {
      return this.forceLogin();
    }

    return super.routerCanDeactivate(instruction);
  }

  forceLogin() {
    if (!!this.loginPromise) { return this.loginPromise; }

    this.loginPromise = new Promise((resolve, reject) => {
      this.ModalLogin.open(resolve, reject);
    }).then(
      (ans) => {
        this.ModalLogin.close();
        this.loginPromise = null;

        if (!!ans) { // Good Reply
          return Promise.resolve(true);
        }
        return false; // Just Fail It!
        // or
        //return this.forceLogin(); // Really Enforce Login, repopping the modal
      },
      (error) => {
        alert(JSON.stringify(error));

        // Dbl check Modal is closed
        try { this.ModalLogin.close(); } catch(e) { }
        this.loginPromise = null;

        return false; // Just Fail It!, leaving a closed modal
        // or
        //return this.forceLogin(); // Really Enforce Login, repopping the modal
      }
    );

    return this.loginPromise;
  }
}
