import { UtilsService } from '@services/utils.service';
import { IEvent } from '@core/models/eventmodels/event.model';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-card',
  template: `
    <nz-card
      nzHoverable
      class="viewcardevent"
      [nzLoading]="loading"
      [nzCover]="coverTpl"
    >
      <ng-template #coverTpl>
        <img [src]="item.eventCover" [alt]="item.name" />
      </ng-template>
      <nz-card-meta [nzTitle]="title" [nzDescription]="description">
      </nz-card-meta>
      <ng-template #title>
        <h3 class="subtitle">
          {{ item.name }}
        </h3>
      </ng-template>

      <ng-template #description>
        <!-- <p class="paragraph normal">
          {{ item.description | shortParagraph: 120 }}
        </p> -->
        <p>
          {{ item.createEvent | date: 'short' }}
        </p>
      </ng-template>
    </nz-card>
  `,
  styleUrls: ['./card.component.scss'],
  host: {
    '(click)': 'clickCard($event)'
  }
})
export class CardComponent implements OnInit {
  private source: IEvent;
  visible = false;
  loading = true;
  @Input() set item(ev: IEvent) {
    if (ev.eventCover !== null) {
      this.visible = true;
    }
    this.source = this.prepareEvent(ev);
    this.loading = false;
  }
  get item() {
    return this.source;
  }
  constructor(private utilsService: UtilsService, private router: Router) {}
  prepareEvent = (event: IEvent) => ({
    ...event,
    eventCover: this.utilsService.resolvePathImage(
      event.eventCover as string
    ) as string
  });
  ngOnInit(): void {}
  redirectEvent(id: number) {}
  clickCard($event) {
    this.router.navigateByUrl(`/dashboard/view/event/${this.item.id}`);
  }
}
