import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { interval, Subject } from 'rxjs';
import { IMessage } from './../../model';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  NgZone,
  ViewContainerRef,
  TemplateRef,
  ComponentFactoryResolver
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MessageComponent } from './message.component';
import { ConversationService } from '../../services/conversation.service';
@Component({
  selector: 'app-chat-conversation',
  template: `
    <cdk-virtual-scroll-viewport
      itemSize="20"
      class="chat-card_list_conversation"
      #virtualScroll
    >
      <ng-template #chat></ng-template>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class ChatConversationComponent implements OnInit, OnChanges, OnDestroy {
  // Container of messages of the chat
  @ViewChild('chat', { read: ViewContainerRef, static: true })
  vlcContainerChat: ViewContainerRef;

  @ViewChild('virtualScroll', { static: true })
  refScroll: CdkVirtualScrollViewport;

  scrollHandle$ = new Subject<void>();
  destroy$ = new Subject<void>();

  constructor(
    private zone: NgZone,
    private resolverComponent: ComponentFactoryResolver,
    private conversationService: ConversationService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  _items: IMessage[] = [];
  @Input() set items(v: IMessage[]) {
    this.createAllMessages(v);

    this._items = v;
  }

  get items() {
    return this._items;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.items) {
      this.scrollHandle$.next();
    }
  }

  /*=============================================
  =            CRUD VIEW CHAT            =
  =============================================*/

  // mantain  scroll in the bottom
  private bottomScroll() {
    setTimeout(() => {
      this.refScroll.scrollTo({
        bottom: 0,
        behavior: 'auto'
      });
    }, 2);
  }
  // create item messsage

  private addItemMessage(item: IMessage, index?: number) {
    const componentFactory = this.resolverComponent.resolveComponentFactory(
      MessageComponent
    );
    const componentResolve = this.vlcContainerChat.createComponent(
      componentFactory,
      index
    );
    componentResolve.instance.item = item;
    componentResolve.changeDetectorRef.markForCheck();
  }

  // create  all messages
  private createAllMessages(items: IMessage[]) {
    this.vlcContainerChat.clear();
    items.forEach((item) => this.addItemMessage(item));
    this.bottomScroll();
  }

  /*=============================================
  =            Listens            =
  =============================================*/

  private eventsConversation() {
    this.conversationService.onNewMessageSub$
      .pipe(untilDestroyed(this))
      .subscribe((message) => {
        this.addItemMessage(message);
        this.bottomScroll();
      });
  }

  ngOnInit(): void {
    this.eventsConversation();
    // this.scrollHandle$
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     switchMap((_) =>
    //       interval(10).pipe(
    //         take(2),
    //         tap((_) => {
    //           this.zone.runOutsideAngular(() => {
    //             this.bottomScroll();
    //           });
    //         })
    //       )
    //     ),
    //     share()
    //   )
    //   .subscribe();
    // this.scrollHandle$.next();
    // this.createAllMessages(this.items);
  }
}
