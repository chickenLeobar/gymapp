import {
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  FormGroup
} from '@angular/forms';

import ValidePassword from 'password-validator';
const schemaPasword = new ValidePassword();

schemaPasword
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  // .uppercase()
  .has()
  .lowercase()
  .has()
  .not()
  .spaces();

export class MyCustomValidators {
  static limitNumber(limit: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: number = control.value;
      if (value > limit) {
        return { limit, actual: value };
      } else {
        return null;
      }
    };
  }
  /**
   *
   * verifica que existe el valor en el arrar en base a un criterio
   * @param criteria
   * @param value
   * @param array
   */
  static verifyCriteriaInArray(
    criteria: string,
    array: any[],
    message?: string
  ) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!isNaN(Number(value))) {
        return null;
      }
      const val = array.find((obj) => obj[criteria] === value);
      if (!val) {
        const msg = `${value} : no esta disponible` || message;
        return { notFoundInArray: msg };
      }
    };
  }
  static identStrings(cads: [string, string], form: string): ValidatorFn {
    return (groupForm: FormGroup): ValidationErrors | null => {
      try {
        const contr = cads.map((item) => this[form].get(item).value);
        return contr[0] === contr[1] ? null : { equalsStrings: true };
      } catch (error) {
        return null;
      }
    };
  }

  static verifyPassword(): ValidatorFn {
    const getError = (error: string, message: string, errors: string[]) => {
      const value = errors.some((data) => data === error);
      return value ? { password: message } : false;
    };
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const respPassord: string[] = schemaPasword.validate(value, {
        list: true
      }) as string[];
      if (respPassord.length === 0) {
        return null;
      }
      const error = respPassord.shift();
      switch (error) {
        case 'min': {
          return { password: 'la contraseña es muy corta' };
        }
        case 'uppercase': {
          return { password: 'Debe incluir al menos una mayúscula' };
        }
        case 'spaces': {
          return { password: 'no incluya espacios' };
        }
      }
    };
  }
}
