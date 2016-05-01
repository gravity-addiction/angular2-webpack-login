import {
  it,
  describe,
  async,
  inject,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';

import {Signup} from './signup';

describe('Signup Component', () => {

  beforeEachProviders((): any[] => []);


  it('should ...', async(inject([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    tcb.createAsync(Signup).then((fixture) => {
      fixture.detectChanges();
    });
  })));

});
