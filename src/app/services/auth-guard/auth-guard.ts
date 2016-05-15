import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Guard, TraversalCandidate } from '@ngrx/router';

import { tokenNotExpired } from 'angular2-jwt';

import { App } from '../../app';

@Injectable()
export class AuthGuard implements Guard {

  constructor(private _http: Http) { }

  protectRoute(candidate: TraversalCandidate) {
    // `route` is the current route being evaluated
    //const route: Route = candidate.route;

    // `locationChange` includes the full path and type of change that caused traversal
    //const locationChange: LocationChange = candidate.locationChange;

    // `queryParams` are the parsed query parameters
    //const queryParams: any = candidate.queryParams;

    // `routeParams` is a snapshot of the route parameters discovered so far
    //const routeParams: any = candidate.routeParams;

    // `isTerminal` indicates that the candidate route is going to be the last route traversed
    //const isTerminal: boolean = candidate.isTerminal;

//console.log('Route: ', route);
//console.log('LocationChange: ', locationChange);
//console.log('queryparams: ', queryParams);
//console.log('routeparams: ', routeParams);
//console.log('isTerminal: ', isTerminal);

    if (tokenNotExpired('jwt')) {
      // Good Auth
      return Observable.of(true);
    }

    // Not so good Auth
    let forceObservable: Observable<any> = new Observable(observer => { App._forceLoginObserver.next(observer); });
    return forceObservable;
    //return Observable.of(false);
  }

}
