import { Router, NavigationEnd } from '@angular/router';


const checkRouteUrl = (router: Router, url: string, callback: (url?: string) => {}) => {
  router.events.subscribe(e => {
    if (e instanceof NavigationEnd) {
      if (e.url === url) {
        callback(e.url);
      }
    }
  });
};



export const utils = {
  checkRouteUrl
};
