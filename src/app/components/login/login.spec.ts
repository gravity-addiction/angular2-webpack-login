import {
  it,
  describe,
  async,
  inject,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';

import {Login} from './login';

describe('Login Component', () => {

  beforeEachProviders(() => []);


  it('should ...', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.createAsync(Login).then((fixture) => {
      fixture.detectChanges();
    });
  })));

});
