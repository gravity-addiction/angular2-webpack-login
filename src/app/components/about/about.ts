import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'about',
  template: require('./about.html'),
  styles: [require('./about.scss')],
  providers: [],
  directives: [ ...ROUTER_DIRECTIVES ],
  pipes: []
})
export class About implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello About');
  }

}
