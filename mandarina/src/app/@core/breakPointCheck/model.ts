import { MediaChange } from '@angular/flex-layout';

export enum EBreakpoints {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  // gt
  gtXs = 'gt-xs',
  gtSm = 'gt-sm',
  gtMd = 'gt-md',
  gtLg = 'gt-lg',
  //
  ltSm = 'lt-sm',
  ltMd = 'lt-md',
  ltLg = 'lt-lg',
  ltXl = 'lt-xl'
}

export interface IBreakWithCallback {
  breakPoint: EBreakpoints;
  callback: (...args: []) => void;
}

export class BreakWithCallback implements IBreakWithCallback {
  breakPoint: EBreakpoints;
  callback: (...args: []) => void;
  static instace(source: IBreakWithCallback) {
    let obj = new BreakWithCallback();
    obj = Object.assign(obj, source);
    return obj;
  }
  matchBrakPoint(changues: MediaChange[]) {
    if (changues.some((el) => el.mqAlias == this.breakPoint)) {
      this.callback();
    }
  }
}
