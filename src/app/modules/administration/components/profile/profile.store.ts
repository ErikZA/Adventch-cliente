import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { Profile } from '../../models/profile/profile.model';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { AuthService } from '../../../../shared/auth.service';
import { AdministrationService } from '../../administration.service';
import { Feature } from '../../models/feature.model';
import { EditProfile } from '../../models/profile/edit-profile.model';
import { NewProfile } from '../../models/profile/new-profile.model';
import { Module, EModules } from '../../../../shared/models/modules.enum';
import { auth } from '../../../../auth/auth';

@Injectable()
export class ProfileStore {

  profiles$: Observable<Profile[]>;
  profileEdit: EditProfile;
  private _profiles: BehaviorSubject<Profile[]>;
  features$: Observable<Feature[]>;
  private _features: BehaviorSubject<Feature[]>;
  private dataStore: {
    profiles: Profile[]
    features: Feature[]
  };

  constructor(
    private service: AdministrationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private location: Location,
    private sidenavService: SidenavService
  ) {
    this.dataStore = {
      profiles: [],
      features: []
    };
    this._profiles = <BehaviorSubject<Profile[]>>new BehaviorSubject([]);
    this.profiles$ = this._profiles.asObservable();
    this._features = <BehaviorSubject<Feature[]>>new BehaviorSubject([]);
    this.features$ = this._features.asObservable();
  }

  public loadAllProfiles(): void {
    const { id } = auth.getCurrentUnit();
    this.service.getProfiles(id).subscribe((data: Profile[]) => {
      data.sort((a, b) => a.name.localeCompare(b.name));
      this.dataStore.profiles = data;
      this._profiles.next(Object.assign({}, this.dataStore).profiles);
    }, err => console.log('Could not load todos profiles.'));
  }

  public loadEditProfile(id: number): Observable<EditProfile> {
    return this.service.getEditProfile(id);
  }

  public removeProfile(profile: Profile) {
    this.service.deleteProfile(profile.id).subscribe(() => {
      this.dataStore.profiles.forEach((r, i) => {
        if (r.id === profile.id) {
          this.dataStore.profiles.splice(i, 1);
        }
      });
      this.snackBar.open('Papel removido com sucesso!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao remover papel, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  public newProfile(newProfile: NewProfile) {
    return this.service.postProfile(newProfile).do((profile: Profile) => {
      this.loadAllProfiles();
      setTimeout(() => {
        this.location.back();
        this.sidenavService.close();
      }, 1000);
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao cadastrar o papel, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  public editProfile(dataProfile: EditProfile) {
    return this.service.putProfile(dataProfile).do(() => {
      this.loadAllProfiles();
      setTimeout(() => {
        this.location.back();
        this.sidenavService.close();
      }, 1000);
    }, err => {
      console.log(err);
        this.snackBar.open('Erro ao editar o papel, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  public searchProfile(search: string): Observable<Profile[]> {
    search = search.toLowerCase();
    const { profiles } = this.dataStore;
    if (search === '') {
      return this.profiles$;
    }
    return Observable.of(profiles.filter(data => {
      return data.name.toLowerCase().indexOf(search) !== -1
      || new Module(data.software).getModuleName().toLowerCase().indexOf(search) !== -1;
    }));
  }

  public loadFeatures(software: EModules): void {
    this.service.getFeaturesBySoftware(software).subscribe((data: Feature[]) => {
      this.dataStore.features = data;
      this._features.next(Object.assign({}, this.dataStore).features);
    }, err => console.log('Could not load todos features.'));
  }



  // public filterProfileModule(module: EModules): Observable<Profile[]> {
  //   if (module) {
  //     return this.profiles$;
  //   }
  //   return this.profiles$.pipe(
  //     map((todos: Profile[]) => todos.filter((item: Profile) => item.module === module))
  //   );
  // }


  // public filterFeaturesByModule(module: EModules): Observable<Feature[]> {
  //   if (!module) {
  //     return Observable.of(null);
  //   }
  //   return this.features$.pipe(
  //     map((todos: Feature[]) => todos.filter((item: Feature) => item.module === module))
  //   );
  // }
}
