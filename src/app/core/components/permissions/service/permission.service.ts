import { Injectable } from '@angular/core';
import { Permission } from '../../../../shared/models/permission.model';
import { Profile } from '../../../../modules/administration/models/profile/profile.model';
import { User } from '../../../../shared/models/user.model';
import { Feature } from '../../../../modules/administration/models/feature.model';
import { auth } from '../../../../auth/auth';

@Injectable()
export class PermissionService {

  private user: User;

  constructor() {
    auth.currentUser.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }

  private getUser(): void {
    this.user = auth.getCurrentUser();
  }

  private getFeaturesArrayUser(): Array<number> {
    const profiles = this.getProfilesUser();
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      return [];
    }
    const features = [];
    profiles.forEach(x => features.push(...x.features.map(f => f.id)));
    return features;
  }

  private getFeaturesUser(): Feature[] {
    const profiles = this.getProfilesUser();
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      return [];
    }
    const features = [];
    profiles.forEach(x => features.push(...x.features.map(f => f)));
    return features;
  }

  public checkProfileContaisSoftware(software: number): boolean {
    const profiles = this.getProfilesUser();
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) { return false; }
    return profiles.some(p => p.software === software);
  }

  public getProfilesUser(): Profile[] {
    if (!this.user) { return null; }
    const { profiles } = this.user;
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) { return []; }
    return profiles;
  }

  public checkFeatureAccess(feature: number): boolean {
    this.getUser();
    const features = this.getFeaturesArrayUser();
    if (!features || !Array.isArray(features) || features.length === 0) {
      return false;
    }
    return features.some(a => a === feature);
  }

  public checkPermissionAccess(feature: number, permission: number): boolean {
    this.getUser();
    const _feature = this.findFeature(feature);
    if (!_feature || _feature === null || _feature === undefined) { return false; }
    const _permission = this.findPermission(_feature, permission);
    if (!_permission || _permission === null || _permission === undefined) { return false; }
    return _permission.isActive;
  }

  public findFeature(feature: number): Feature {
    const features = this.getFeaturesUser();
    if (!features || !Array.isArray(features) || features.length === 0) { return null; }
    return features.find(f => f.id === feature);
  }

  public findPermission(feature: Feature, permission: number): Permission {
    if (!feature.permissions || feature.permissions === null || feature.permissions === undefined) { return null; }
    return feature.permissions.find(p => p.id === permission);
  }

  public getFeature(featureId: number): Feature {
    this.getUser();
    const { profiles } = this.user;
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      return null;
    }
    return this.findFeaturesInProfile(profiles, featureId);
  }

  private findFeaturesInProfile(profiles: Profile[], feature: number): Feature {
    let featureFound;
    profiles.forEach(profile => {
      if (profile.features.find(f => f.id === feature)) {
        featureFound = profile.features.find(f => f.id === feature);
      }
    });
    return featureFound;
  }

  public splitFeature(featureAndPermission: string): string {
    const data = featureAndPermission.split(':');
    return data[0];
  }

  public splitPermission(featureAndPermission: string): string {
    const data = featureAndPermission.split(':');
    return data[1];
  }

}
