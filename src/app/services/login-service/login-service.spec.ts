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
import {LoginService} from './login-service';


describe('LoginService Service', () => {

  beforeEachProviders(() => [LoginService]);


  it('should ...', inject([LoginService], (service: LoginService) => {

  }));

});
