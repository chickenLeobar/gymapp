import { LeSafeAny } from "./../core/types/anyType";
import Configstore from "configstore";
import _ from "lodash";
import { addParamsInString } from "../helpers/functionHelpers";

class CustomConfigStore extends Configstore {
  constructor(
    packageName: string,
    defaults?: any,
    options?: Configstore.ConfigstoreOptions
  ) {
    super(packageName, defaults, options);
  }

  public pushInArray(path: string, item: LeSafeAny, created: boolean = false) {
    const data = this.get(path) as LeSafeAny[];
    const isArray = _.isArray(data);
    if (!data && !created) {
      throw new Error(
        `${path} not present in store, considered  flag created in true`
      );
    }
    if (!data && created) {
      this.set(path, [item]);
      return;
    }
    if (isArray) {
      this.set(path, [...data, item]);
    } else {
      throw new Error(`${path}  exists, but that ${data}  not is Array`);
    }
  }

  /*=============================================
  =            Helpers            =
  =============================================*/

  addParams(cad: string, params: LeSafeAny) {
    return addParamsInString(cad, params);
  }
}
const configStore = new CustomConfigStore("backend");

export default configStore;
