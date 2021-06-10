import { GraphQLError } from "graphql";
import { User } from "./../entity/User";
import { InputUser } from "./../types/User";
import {
  registerDecorator,
  ValidateByOptions,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import {
  MiddlewareFn,
  MiddlewareInterface,
  NextFn,
  ResolverData,
} from "type-graphql";

@ValidatorConstraint({ async: true })
class EmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  async validate(): Promise<boolean> {
    return true;
  }
}

export function EmailAlreadyExist(validationOption?: ValidationOptions) {
  return (target: Object, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      name: "EmailAlreadyExist",
      validator: EmailAlreadyExistConstraint,
    });
  };
}
import { InjectManager } from "typeorm-typedi-extensions";
import { EntityManager } from "typeorm";

export class EmailALreadyExistClass implements MiddlewareInterface {
  constructor(@InjectManager() private manager: EntityManager) {}
  async use({ args, context, info, root }: ResolverData, next: NextFn) {
    const inputUser = args.user as InputUser;
    if (await this.manager.find(User, { where: { email: inputUser.email } })) {
      new GraphQLError("Email Already Exist");
    } else {
      await next();
    }
  }
}
