import { Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';

import { createTree } from '../testing';
import { RouteParamsService } from './route-params.service';

describe('RouteParamsService', () => {
  describe('getParams()', () => {
    const routerStub = {
      routerState: {
        snapshot: {
          root: createTree(
            { params: { schoolId: '03' } },
            { params: { teacherId: '99' } }
          )
        }
      }
    };

    const RouterStub = { provide: Router, useValue: routerStub };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [RouteParamsService, RouterStub]
      });
    });

    it('returns an object of route parameter values',
      inject([RouteParamsService], (service: RouteParamsService) => {
        const expected = { schoolId: '03', teacherId: '99' };
        const actual = service.getParams();

        expect(actual).toEqual(expected);
    }));
  });

  describe('setParams()', () => {
    const routerStub = {
      routerState: {
        snapshot: {
          url: '/school/2/teacher/4?hello=true',
          root: createTree(
            { routeConfig: null },
            { routeConfig: { path: '' } },
            { routeConfig: { path: 'school' } },
            { routeConfig: { path: ':schoolId' } },
            { routeConfig: { path: 'teacher/:teacherId' } }
          )
        }
      }
    };

    const RouterStub = { provide: Router, useValue: routerStub };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [RouteParamsService, RouterStub]
      });
    });

    it('returns a url with changed route parameters',
      inject([RouteParamsService], (service: RouteParamsService) => {
        const expected = '/school/333333/teacher/4?hello=true';
        const actual = service.setParams({ schoolId: 333333 });

        expect(actual).toEqual(expected);
    }));
  });
});
