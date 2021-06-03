import { ERol, RolService } from './../../../../../services/rol.service';
import { FormControl, Validators } from '@angular/forms';
import { ChatuiService } from './../../services/chatui.service';
import {
  CdkPortalOutlet,
  CdkPortalOutletAttachedRef,
  Portal,
  PortalOutlet,
  TemplatePortal
} from '@angular/cdk/portal';
import { typID } from '@core/models/types';
import {
  IlistMessageItem,
  IRecentMessages,
  IUserChat,
  IMessage
} from './../../model';
import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  TemplateRef,
  ViewContainerRef,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { gsap } from 'gsap';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, of, Observable } from 'rxjs';
import { ChatDataService } from '../../services/chat-data.service';
import _ from 'lodash';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['../styles.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: []
})
@UntilDestroy()
export class ChatCardComponent implements OnInit, OnChanges, OnDestroy {
  config: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 10,
    mousewheel: true
  };

  // message
  messageControl: FormControl = new FormControl('', [Validators.required]);

  recentsMessages: Observable<IRecentMessages[]> = of([]);
  activeUsers: Observable<IUserChat[]> = of([]);
  messages$: Observable<IMessage[]> = of([]);
  // subject for destroy susscriptions
  private $destroy = new Subject<void>();

  @ViewChild(CdkPortalOutlet) host: PortalOutlet;
  currentScreen: Portal<any>;
  // templates
  @ViewChild('principal', { read: TemplateRef, static: true })
  principalTpl: TemplateRef<any>;

  @ViewChild('messagges', { read: TemplateRef, static: true })
  messagesTpl: TemplateRef<any>;

  // reference to card container chat
  @ViewChild('card') cardElement: ElementRef<HTMLDivElement>;
  // portals
  _principalScreenTemplate: TemplatePortal<any>;
  messageScreenTemplate: TemplatePortal<{ id: typID }>;

  // variables in view
  nameRemitent: Observable<string> = of('');

  // name of participant

  // variables manipule state

  isUser: boolean;
  constructor(
    private viewRef: ViewContainerRef,
    private chatUiService: ChatuiService,
    private dataService: ChatDataService,
    private rolService: RolService
  ) {
    this.rolService.isOnlyRol(ERol.USER).then((res) => {
      if (res) {
        this.isUser = res;
      }
    });
  }
  ngOnDestroy(): void {
    this.dataService.detroyEvent();
  }
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {
    // this.renderScreen();
    this.animationsCard();
    this.setupObservable();
    this.listenChanguesForm();
    this.renderScreen();
    this.nameRemitent = this.dataService.nameUser;
    this.listenOpenChat();
  }

  // Subscriptor a evento externos de abrir chat
  private listenOpenChat() {
    this.chatUiService.observeOpenChat$
      .pipe(untilDestroyed(this))
      .subscribe((val) => {
        this.enterChat(val);
      });
  }

  /*=============================================
 =            GETS BASICS            =
 =============================================*/

  getPrincipalTemplate() {
    if (this._principalScreenTemplate) {
      return this._principalScreenTemplate;
    } else {
      this._principalScreenTemplate = new TemplatePortal(
        this.principalTpl,
        this.viewRef
      );

      return this._principalScreenTemplate;
    }
  }
  /**
   * si existe la conversacion
   */

  private renderScreen() {
    this.currentScreen = this.getPrincipalTemplate();
    // this.currentScreen = this.getMessageTemplate({ id: 9 });
  }

  private listenChanguesForm() {
    this.messageControl.valueChanges.subscribe(async (value) => {
      //  addd message
      await this.dataService
        .createMessage({
          id_conversation: this.currentConversation,
          message: value
        })
        .toPromise();
    });
  }

  private setupObservable(): void {
    this.dataService.init();
    // fill observables
    this.recentsMessages = this.dataService.recentMessages$;
    this.activeUsers = this.dataService.activeUsers$;
    this.messages$ = this.dataService.messages$;
  }

  private animationsCard() {
    this.chatUiService
      .suscribeAnimationWithName('card:open')
      .pipe(takeUntil(this.$destroy))
      .subscribe((_) => {
        gsap.fromTo(
          this.cardElement.nativeElement,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1
          }
        );
      });
  }

  get currentConversation() {
    const id = localStorage.getItem('conver');
    if (id) {
      return Number(id);
    }
    return undefined;
  }
  set currentConversation(id: number) {
    localStorage.setItem('conver', String(id));
  }

  // reverse  principal
  backPrincipal() {
    localStorage.removeItem('conver');
    // destroy
    this.dataService.destroyOnNewMessage();
    this.currentScreen = this.getPrincipalTemplate();
  }
  // click in avatar
  enterChat(id: number) {
    const sub = this.dataService
      .createConversation(Number(id))
      .subscribe((conver) => {
        console.log('conversation');
        console.log(conver);

        sub.unsubscribe();
        this.currentScreen = this.getMessageTemplate({ id: conver.id });
      });
  }

  // build messages in template
  getMessageTemplate(ctx: { id: typID }) {
    this.dataService.suscribeOnNewMessage({ idConversation: Number(ctx.id) });
    this.currentConversation = Number(ctx.id);
    if (this.messageScreenTemplate) {
      this.messageScreenTemplate.context = ctx;
      return this.messageScreenTemplate;
    } else {
      this.messageScreenTemplate = new TemplatePortal(
        this.messagesTpl,
        this.viewRef,
        ctx
      );
      return this.messageScreenTemplate;
    }
  }

  clickItem(ctx: { id: typID }) {
    // set currrent conversation id
    this.dataService.getConversation(Number(ctx.id)).then((res) => {
      console.log('data');

      this.currentScreen = this.getMessageTemplate({ id: res.id });
    });
  }
}
