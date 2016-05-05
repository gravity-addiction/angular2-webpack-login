import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

@Component({
  selector: 'about',
  template: require('./about.html'),
  styles: [require('./about.scss')],
  providers: [],
  directives: [],
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
