import { NzModalModule } from 'ng-zorro-antd/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsviewRoutingModule } from './eventsview-routing.module';
import { EventsviewComponent } from './eventsview.component';
import { ListeventsComponent } from './pages/listevents/listevents.component';
import { MatCardModule } from '@angular/material/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FlexLayoutModule } from '@angular/flex-layout';
// service provide of principal module events
import { EventService as EventServiceModule } from '../events/services/event.service';
import { DisplayeventComponent } from './pages/displayevent/displayevent.component';
import { EventService } from './services/event.service';
import { SesionService as PrincipalSesionService } from '../events/services/sesion.service';
import { DisplaySesionComponent } from './pages/display-sesion/display-sesion.component';
import { PipeShortParagraphModule } from '@core/pipes/short-paragraph.pipe';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';

import { NzImageModule } from 'ng-zorro-antd/image';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { PlayerModule } from '@core/modules/player/player.module';

/* Masonry Library 
documentation : https://github.com/wynfred/ngx-masonry/
*/
import { NgxMasonryModule } from 'ngx-masonry';
import { ItemSesionComponent } from './components/item-sesion/item-sesion.component';
import { CommentsModule } from '@core/modules/comments/comments.module';
import { CardComponent } from './pages/listevents/components/card.component';
import { RowShowComponent } from './pages/listevents/components/row-show.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { DisplayCategorieComponent } from './pages/listevents/components/display-categorie/display-categorie.component';
import { ResolveUrlPipeModule } from '@core/pipes/resolve-url.pipe';
import { NzListModule } from 'ng-zorro-antd/list';
// me
import { ViewMoreModule } from '@core/directives/view-more.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { MatDialogModule } from '@angular/material/dialog';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatRippleModule } from '@angular/material/core';
import { BagdgeActionComponent } from './components/bagdge-action/bagdge-action.component';
import { BagdeActionItemComponent } from './components/bagdge-action/bagde-action-item/bagde-action-item.component';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { TitleModule } from '@core/ui/title/title.module';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { CommonEventSesionComponent } from './components/common-event-sesion/common-event-sesion.component';
import { MediaModule } from '@delon/abc/media';
import { ReproductorComponent } from './components/reproductor/reproductor.component';
import { PlyrModule } from 'ngx-plyr';
import { InteractionServiceEvent } from './services/interaction.service';
const zorro = [
  NzButtonModule,
  NzModalModule,
  NzEmptyModule,
  NzSpaceModule,
  NzCardModule,
  NzSpinModule,
  NzListModule,
  NzImageModule,
  NzDescriptionsModule,
  NzIconModule,
  NzOutletModule,
  NzTypographyModule,
  NzDrawerModule,
  NzBadgeModule,
  MediaModule
];

const material = [
  MatCardModule,
  MatRippleModule,
  ScrollingModule,
  MatDialogModule
];
const me = [ViewMoreModule, TitleModule];

@NgModule({
  declarations: [
    EventsviewComponent,
    ListeventsComponent,
    DisplayeventComponent,
    DisplaySesionComponent,
    ItemSesionComponent,
    CardComponent,
    RowShowComponent,
    DisplayCategorieComponent,
    BagdgeActionComponent,
    BagdeActionItemComponent,
    CommonEventSesionComponent,
    ReproductorComponent
  ],
  exports: [CardComponent],
  imports: [
    CommonModule,
    EventsviewRoutingModule,
    ...zorro,
    ...material,
    ...me,
    ResolveUrlPipeModule,
    CommentsModule,
    FlexLayoutModule,
    PipeShortParagraphModule,
    NgxMasonryModule,
    PlayerModule.forRoot(),
    SwiperModule,
    PlyrModule
  ],
  providers: [
    EventServiceModule,
    EventService,
    InteractionServiceEvent,
    PrincipalSesionService
  ]
})
export class EventsviewModule {}
