import { SubscriptionLike } from 'rxjs';
import { EBreakpoints } from './model';

export type SafeAny = any;

interface ClassType<T = any> {
  new (...args: SafeAny[]): T;
}

export const _register: unique symbol = Symbol('__register');
export const _namesBreakMethods: unique symbol = Symbol('__name_methods');
export const _subscriptionObserver: unique symbol = Symbol('__sub_observer');

export const obtainInitializeArray = <T>(
  target: ClassType,
  symbol: symbol
): T[] => {
  if (!target[symbol]) {
    target[symbol] = [] as T[];
  }
  return target[symbol] as T[];
};
export type paylodRegister = {
  breakpoint: EBreakpoints;
  method: string;
};

export type OptionBreakPoint = {
  nameObserver: string;
};

export const unsuscribe = (subscription: SubscriptionLike) => {
  return (
    subscription &&
    isFunction(subscription.unsubscribe) &&
    subscription.unsubscribe()
  );
};

export const isFunction = (target: unknown) => {
  return typeof target == 'function';
};

export const onDestroyPrperties = (target: SafeAny) => {
  if (target[_namesBreakMethods]) {
    console.log('have observerr');

    target[_namesBreakMethods] = [];
  }
  if (target[_subscriptionObserver]) {
    console.log('have unsuscribe');

    unsuscribe(target[_subscriptionObserver]);
  }
};
