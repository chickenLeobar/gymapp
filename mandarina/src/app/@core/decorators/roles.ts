import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ERol } from 'src/app/services/rol.service';

const roleDecorator = (rol: ERol): MethodDecorator => {
  return (
    target: NzSafeAny,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<NzSafeAny>
  ) => {};
};
