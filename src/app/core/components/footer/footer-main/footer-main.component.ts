import { takeWhile, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import { Release } from '../../../../shared/models/release.model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer-main',
  templateUrl: './footer-main.component.html',
  styleUrls: ['./footer-main.component.scss']
})
@AutoUnsubscribe()
export class FooterMainComponent implements OnInit, OnDestroy {

  get year(): number { return new Date().getFullYear(); }

  public currentVersion = 'v0.0.0';
  private subVersion: Subscription;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.subVersion = this.getData()
      .subscribe();
  }

  ngOnDestroy(): void {

  }

  private getData() {
    return this.sharedService
      .getCurrentRelease()
      .pipe(
        takeWhile((data: Release) => !!data),
        tap((data: Release) => this.getCurrentRelease(data))
      );
  }

  private getCurrentRelease(data: Release): void {
    if (!this.currentVersion || this.currentVersion === 'v0.0.0' || this.currentVersion !== data.version) {
      if (data != null || data !== undefined) {
        this.currentVersion = data.version;
      }
    }
  }

}
