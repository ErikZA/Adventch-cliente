import { Unit } from '../shared/models/unit.model';

import { EventEmitter } from '@angular/core';
import { User } from '../shared/models/user.model';
import { Responsible } from '../modules/scholarship/models/responsible';

import * as Raven from 'raven-js';

import { JwtHelperService } from '@auth0/angular-jwt';
import { Profile } from '../modules/administration/models/profile/profile.model';

const showApp: EventEmitter<boolean> = new EventEmitter<boolean>();
const currentUser: EventEmitter<User> = new EventEmitter<User>();
const currentUnit: EventEmitter<Unit> = new EventEmitter<Unit>();
const currentResponsible: EventEmitter<Responsible> = new EventEmitter<Responsible>();

const parseJsonObject = (data: any) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

const setLocalStorage = (name: string, data: any) => {
  localStorage.setItem(name, JSON.stringify(data));
};

const getLocalStorage = (name: string) => {
  if (!localStorage.getItem(name)) { return null; }
  return parseJsonObject(localStorage.getItem(name));
};

const setCurrentUser = (user: User) => {
  setLocalStorage('currentUser', user);
  currentUser.emit(user);
};

const getCurrentUser = () => {
  const user: User = getLocalStorage('currentUser');
  return user;
};

const setCurrentUnit = (unit: Unit) => {
  setLocalStorage('currentUnit', unit);
  currentUnit.emit(unit);
};

const getCurrentUnit = () => {
  const unit: Unit = getLocalStorage('currentUnit');
  return unit;
};

const setCurrentResponsible = (responsible: Responsible) => {
  setLocalStorage('currentResponsible', responsible);
  currentResponsible.emit(responsible);
};

const getCurrentResponsible = () => {
  const responsible: Responsible = getLocalStorage('currentResponsible');
  return responsible;
};

const setLastLogin = (login: string) => {
  setLocalStorage('lastLogin', login);
};

const getLastLogin = () => {
  return getLocalStorage('lastLogin');
};

const setMainToken = (token: string) => {
  setLocalStorage('token', token);
};

const getMainToken = () => {
  return getLocalStorage('token');
};

const setResponsibleToken = (token: string) => {
  setLocalStorage('token', token);
};

const getResponsibleToken = () => {
  return getLocalStorage('token');
};

const setUserUnits = (units: Unit[]) => {
  setLocalStorage('user-units', units);
};

const getUserUnits = () => {
  return getLocalStorage('user-units');
};

const decodeToken = (token: string): {
  userUnitId?: number,
  userId?: number,
  profiles: Profile[]
} => {
  const helper = new JwtHelperService();
  // const token = auth.getMainToken();

  const decoded = helper.decodeToken(token);
  const profiles = JSON.parse(decoded['user-profiles']);
  return {
    userUnitId: parseInt(decoded['user-unit'], 10),
    userId: parseInt(decoded['user-id'], 10),
    profiles: Array.isArray(profiles) ? profiles : []
  };
};

const getCurrentDecodedToken = () => {
  const token = getMainToken();
  return decodeToken(token);
};

const loggedInMain = () => {
  const user: User = getCurrentUser();
    if (user) {
      currentUser.emit(user);
      showApp.emit(true);
    }
};

const loggedInResponsible = () => {
  const responsible: Responsible = getCurrentResponsible();
    if (responsible) {
      currentResponsible.emit(responsible);
      showApp.emit(true);
    }
};

const logoffMain = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
  localStorage.removeItem('currentUnit');
  localStorage.removeItem('user-units');
  Raven.setUserContext();
  const user: User = new User();
  user.email = getLastLogin();
  currentUser.emit(user);
  showApp.emit(false);
};

const logoffResponsible = () => {
  localStorage.removeItem('currentResponsible');
  localStorage.removeItem('token');
  Raven.setUserContext();
  const responsible: Responsible = new Responsible();
  responsible.cpf = getLastLogin();
  currentResponsible.emit(responsible);
  showApp.emit(false);
};

export const auth = {
  showApp,
  currentUser,
  currentUnit,
  setCurrentUser,
  getCurrentUser,
  setCurrentUnit,
  getCurrentUnit,
  currentResponsible,
  setCurrentResponsible,
  getCurrentResponsible,
  setLastLogin,
  getLastLogin,
  setMainToken,
  getMainToken,
  setResponsibleToken,
  getResponsibleToken,
  setUserUnits,
  getUserUnits,
  loggedInMain,
  loggedInResponsible,
  logoffMain,
  logoffResponsible,
  decodeToken,
  getCurrentDecodedToken,
};
