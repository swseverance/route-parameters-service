import { Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';

import { RouteParamsService } from './route-params.service';

describe('RouteParamsService', () => {
  describe('getParams()', () => {
    const activatedRouteSnapshotTwo = {
      params: { teacherId: '99' },
      firstChild: null
    };

    const activatedRouteSnapshotOne = {
      params: { schoolId: '03' },
      firstChild: activatedRouteSnapshotTwo
    };

    const routerStub = {
      routerState: {
        snapshot: {
          root: activatedRouteSnapshotOne
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
    const activatedRouteSnapshotV = {
      routeConfig: {
        path: 'teacher/:teacherId'
      },
      firstChild: null
    };

    const activatedRouteSnapshotIV = {
      routeConfig: {
        path: ':schoolId'
      },
      firstChild: activatedRouteSnapshotV
    };

    const activatedRouteSnapshotIII = {
      routeConfig: {
        path: 'school'
      },
      firstChild: activatedRouteSnapshotIV
    };

    const activatedRouteSnapshotII = {
      routeConfig: {
        path: ''
      },
      firstChild: activatedRouteSnapshotIII
    };

    const activatedRouteSnapshotI = {
      firstChild: activatedRouteSnapshotII
    };

    const routerStub = {
      routerState: {
        snapshot: {
          url: '/school/2/teacher/4?hello=true',
          root: activatedRouteSnapshotI
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
