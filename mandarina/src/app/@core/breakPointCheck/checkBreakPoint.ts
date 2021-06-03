import { EBreakpoints } from './model';
import {
  obtainInitializeArray,
  _namesBreakMethods,
  paylodRegister
} from './internals';

export const checkBreakPoint = (breakPoint: EBreakpoints): MethodDecorator => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // const originalMethod = descriptor.value;
    // ad name method for initialize
    (obtainInitializeArray(
      target,
      _namesBreakMethods
    ) as paylodRegister[]).push({
      breakpoint: breakPoint,
      method: propertyKey
    });

    return descriptor;
  };
};
