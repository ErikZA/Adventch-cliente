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

const buildSearchRegex = (str = '') => {
  const strArray = Array.from(str);
  const regexArray = strArray.map(word => {
      if (word === 'a') { return '[à-úÀ-ÚaA]'; }
      if (word === 'e') { return '[à-úÀ-ÚeE]'; }
      if (word === 'i') { return '[à-úÀ-ÚiI]'; }
      if (word === 'o') { return '[à-úÀ-ÚoO]'; }
      if (word === 'u') { return '[à-úÀ-ÚuU]'; }
      return word;
  });
  const strRegex = regexArray.toString().split(',').join('');
  return new RegExp(strRegex, 'ig');
};

export const utils = {
  checkRouteUrl,
  buildSearchRegex
};
