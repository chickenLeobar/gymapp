import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  Inject,
  Injectable,
  Injector
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
// import { FloatComponent } from '../layouts/float/float.component';
@Injectable()
export class ChatuiService {
  private portal: DomPortalOutlet;
  private animation$ = new Subject<string>();
  private openChat$ = new Subject<number>();

  public observeOpenChat$ = this.openChat$.asObservable();

  private closeChat$ = new Subject<void>();

  public observeCloseChat$ = this.closeChat$.asObservable();

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private factory: ComponentFactoryResolver,
    @Inject(DOCUMENT) private document: Document
  ) {}
  get hostPortal() {
    if (this.portal) {
      return this.portal;
    } else {
      this.portal = new DomPortalOutlet(
        this.document.body,
        this.factory,
        this.appRef,
        this.injector
      );
      return this.portal;
    }
  }
  closeChat() {
    this.closeChat$.next();
  }
  openChatWithUser(idUser: number) {
    this.openChat$.next(idUser);
  }
  actionAnimation(animation: string) {
    this.animation$.next(animation);
  }
  suscribeAnimations() {
    return this.animation$.asObservable();
  }
  suscribeAnimationWithName(animation: string) {
    return this.animation$.asObservable().pipe(filter((a) => a == animation));
  }

  buildFloatComponent() {
    if (!this.hostPortal.hasAttached()) {
      import('../layouts/float/float.component').then(({ FloatComponent }) => {
        const component = new ComponentPortal(FloatComponent);
        this.hostPortal.attach(component);
      });
    }
  }
}
