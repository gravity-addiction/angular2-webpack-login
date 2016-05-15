import { enableProdMode, provide } from "@angular/core";
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ELEMENT_PROBE_PROVIDERS } from '@angular/platform-browser';
import { Http, HTTP_PROVIDERS } from '@angular/http';

import { provideRouter, Routes } from '@ngrx/router';

import { AuthConfig, AuthHttp } from 'angular2-jwt';

import { AuthGuard } from 'app/services/auth-guard/auth-guard';

const ENV_PROVIDERS = [];
// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
  enableProdMode();
} else {
  ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS);
}

/*
 * App Component
 * our top level component that holds all of our components
 */
import { App } from './app/app';
import { Home } from './app/components/home/home';
import { About } from "./app/components/about/about";
import { Login } from "./app/components/login/login";
import { Signup } from "./app/components/signup/signup";


const routes: Routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/about',
    guards: [ AuthGuard ],
    component: About
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/signup',
    component: Signup
  }
];
/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
document.addEventListener('DOMContentLoaded', function main() {
  return bootstrap(App, [
    // These are dependencies of our App
    ...HTTP_PROVIDERS
    , ...ENV_PROVIDERS
    , provide(AuthHttp, {
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig({
          tokenName: 'jwt',
          noJwtError: true
        }), http);
      },
      deps: [Http]
    })
    , provideRouter(routes)
    , AuthGuard
  ])
  .catch(err => console.error(err));
});
