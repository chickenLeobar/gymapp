import { LeSafeAny } from "./../core/types/anyType";
import _ from "lodash";
export const transformInArraySql = (arr: string[] | number[]) => {
  let cad = "'{";
  const quote = (val: string) => {
    return `"${val}"`;
  };
  for (let i = 0; i < arr.length; i++) {
    let val = arr[i];
    if (typeof val == "string") {
      val = quote(val);
    }
    if (!(i == arr.length - 1)) {
      val = val + ",";
    }
    cad += val;
  }
  return cad + "}'";
};

import format from "string-template";
export const isValidValue = (value: any): boolean => {
  if (value && typeof value != "undefined" && value != null) {
    return true;
  }
  return false;
};

/**
 *
 * @param cad
 * @param params
 * @returns
 * format string with params
 */
export function addParamsInString(cad: string, params: LeSafeAny): string {
  if (!isValidValue(cad)) {
    return "";
  } else {
    return format(cad, params);
  }
}
