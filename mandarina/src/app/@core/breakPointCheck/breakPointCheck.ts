import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { BreakWithCallback } from './model';
import {
  obtainInitializeArray,
  paylodRegister,
  _register,
  SafeAny,
  _namesBreakMethods,
  OptionBreakPoint,
  onDestroyPrperties,
  _subscriptionObserver
} from './internals';

const registerCallbacks = (target: any) => {
  obtainInitializeArray<paylodRegister>(target, _namesBreakMethods).forEach(
    (payload) => {
      obtainInitializeArray<BreakWithCallback>(target, _register).push(
        // initialize register
        BreakWithCallback.instace({
          breakPoint: payload.breakpoint,
          callback: target[payload.method].bind(target)
        })
      );
    }
  );
};

const listenEventMediaObserver = (target: SafeAny, nameObserver: string) => {
  target[_subscriptionObserver] = (target[nameObserver] as MediaObserver)
    .asObservable()
    .subscribe((changues: MediaChange[]) => {
      obtainInitializeArray<BreakWithCallback>(target, _register).forEach(
        (el) => {
          el.matchBrakPoint(changues);
        }
      );
    });
};

export const BreakPointCheck = (options: OptionBreakPoint): ClassDecorator => {
  return (target: SafeAny) => {
    // recolects callbacks
    const original = target.prototype.ngOnInit;
    target.prototype.ngOnInit = function (...args: any[]) {
      if (!this[options.nameObserver]) {
        console.error(
          `${options.nameObserver}  service not exist please inject ${options.nameObserver} :` +
            `  constructor(
     private ${options.nameObserver}: MediaObserver,
   ) {}`
        );
      }
      registerCallbacks(this);
      listenEventMediaObserver(this, options.nameObserver);
      original.apply(this, args);
    };
    const originalOnDestroy = target.prototype.ngOnDestroy;

    target.prototype.ngOnDestroy = function (...args: []) {
      onDestroyPrperties(this);

      originalOnDestroy && originalOnDestroy.apply(this, args);
    };
  };
};
