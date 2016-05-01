import {
  it,
  describe,
  async,
  inject,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {Component} from 'angular2/core';
import {LoggedInOutlet} from './logged-in-outlet';


@Component({
  selector: 'test-component',
  template: `<div logged-in-outlet></div>`
})
class TestComponent {}

describe('LoggedInOutlet Directive', () => {

  beforeEachProviders(() => []);


  it('should ...', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
    });
  })));

});
