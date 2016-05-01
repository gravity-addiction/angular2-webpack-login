import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {LocalJWT} from './local-jwt';


describe('LocalJWT Service', () => {

  beforeEachProviders(() => [LocalJWT]);


  it('should ...', inject([LocalJWT], (service:LocalJWT) => {

  }));

});
