import { tap } from 'rxjs/operators';
import { NgxMasonryOptions } from 'ngx-masonry';
import { Observable } from 'rxjs';
import { IEvent } from 'src/app/@core/models/eventmodels/event.model';
import { ProfileService } from './../profile/services/profile.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-me-events',
  templateUrl: './me-events.component.html',
  styleUrls: ['./me-events.component.scss']
})
export class MeEventsComponent implements OnInit {
  public events$ = new Observable<IEvent[]>();
  private isEvent: boolean;
  constructor(
    private activateRoute: ActivatedRoute,
    private profileService: ProfileService
  ) {}
  public myOptions: NgxMasonryOptions = {
    gutter: 10
  };
  ngOnInit(): void {
    this.activateRoute.params.subscribe((params: Params) => {
      this.isEvent = params.type == 'events';
      if (this.isEvent) {
        this.events$ = this.profileService.getEventsOfAssisted('EVENT');
      } else {
        console.log('fetch programas');
        this.events$ = this.profileService.getEventsOfAssisted('PROGRAM').pipe(
          tap((data) => {
            console.log(data);
          })
        );
      }
    });
  }
  get type() {
    return this.isEvent ? 'eventos' : 'programas';
  }
}
