/* tslint:disable */
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
