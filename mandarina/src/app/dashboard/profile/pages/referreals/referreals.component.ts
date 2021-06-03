import { IUser } from '@core/models/User';
import { pluck, mergeMap, tap } from 'rxjs/operators';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-referreals',
  templateUrl: './referreals.component.html',
  styleUrls: ['../../profile.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class ReferrealsComponent implements OnInit, OnDestroy {
  referreals: IUser[] = [];
  private recolectSubs = [];
  private unsuscribe: Subject<void> = new Subject<void>();
  constructor(private profileSevice: ProfileService) {}
  ngOnDestroy(): void {
    this.unsuscribe.next();
    this.unsuscribe.complete();
  }

  ngOnInit(): void {
    this.adaptReferreals();
  }

  private adaptReferreals() {
    this.profileSevice
      .getUser(null, 'referreals')
      .pipe(
        tap(() => (this.referreals = [])),
        pluck('data', 'getUser', 'user', 'referreals'),
        mergeMap(from),
        tap((el) => this.referreals.push(el)),
        takeUntil(this.unsuscribe)
      )
      .subscribe();
  }
}
