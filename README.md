# Angular RouteParamsService

The `RouteParamsService` provides methods to make working with Angular's Router more straightforward. It works by traversing the `RouterStateSnapshot`

### Read all route parameters from the current `RouterStateSnapshot` with `getParams()`

```javascript
// current url     '/school/03/teacher/99'

routeParamsService.getParams(); // { schoolId: '03', teacherId: '99' }
```
### Update one or more route parameters within the current `RouterStateSnapshot` (keeping the rest of the url unchanged) with `setParams()`
```javascript
// current         '/school/222/date/2017-04-03?hello=true'
// desired url     '/school/333/date/2017-04-03?hello=true'

const newUrl = routeParamsService.setParams({schoolId: 333333});

this.router.navigateByUrl(newUrl);
```
## The Code
```typescript
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RouteParamsService {
  constructor (private router: Router) { }

  /**
   * returns object containing values of activated
   * route parameters
   */
  getParams (): {[key: string]: string} {
    let params = {};
    let node = this.router.routerState.snapshot.root;

    while (node) {
      Object.assign(params, node.params);
      node = node.firstChild;
    }

    return params;
  }

  /**
   * method of changing individual route parameters within the current
   * url without changing other portions of the url
   */
  setParams (newParams: any): string {
    const routeConfig = this.parseRouteConfig();
    const url = this.router.routerState.snapshot.url.split('/');

    for (let i = 0; i < url.length; i++) {
      const key = url[i];

      if (routeConfig.hasOwnProperty(key)) {
        const value = routeConfig[key];

        if ((i + 1) < url.length && newParams[value] !== undefined) {
          url[i + 1] = newParams[value];
        }
      }
    }

    return url.join('/');
  }

  private isRouteParameter (str: string): boolean {
    return str.charAt(0) === ':';
  }

  private parseRouteConfig (): any {
    const keys = [];
    const values = [];

    let node = this.router.routerState.snapshot.root;

    while (node) {
      if (node.routeConfig && node.routeConfig.path) {
        node.routeConfig.path.split('/').forEach(str => {
          if (this.isRouteParameter(str)) {
            values.push(str.replace(':', ''));
          } else {
            keys.push(str);
          }
        });
      }

      node = node.firstChild;
    }

    const routeConfig = {};

    for (let i = 0; i < keys.length; i++) {
      routeConfig[keys[i]] = values[i];
    }

    return routeConfig;
  }
}
```
## The Specs
```typescript
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
```

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.2.
