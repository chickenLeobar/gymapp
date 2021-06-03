import { LeSafeAny } from "./../../core/types/anyType";
import { Service } from "typedi";
import Config from "../../config/configstore";
import { ConfigEntity } from "./config.entity";
import _ from "lodash";
import { defaultCOnfig } from "../../core/data/defaultConfig";
import { Logger } from "../../services/logger.service";
@Service()
export class ConfigService {
  _LABEL_CONFIG = "config";
  constructor(private logger: Logger) {}
  async saveAndUpdateConfiguration(
    config: LeSafeAny = {},
    label: string = this._LABEL_CONFIG
  ) {
    const existConfig = await ConfigEntity.findOne({ key: label });
    if (existConfig) {
      const oldConfig = existConfig.value;
      const configLocalStore = Config.all;
      const isEmpty = _.isEmpty(configLocalStore);
      // if config local is Empty
      let newConfig;
      if (isEmpty) {
        this.logger.warn({
          reason:
            "La configuracion en local esta vacia, se ha actualizado con información de la base de datos",
        });
        newConfig = _.merge(oldConfig, configLocalStore);
      } else {
        newConfig = _.merge(configLocalStore, defaultCOnfig);
      }

      ConfigEntity.update(existConfig.key, { value: newConfig });
      // save config
      this.logger.info({ msg: "Update Config", oldConfig, configLocalStore });
      Config.set(newConfig);
    } else {
      const oldConfig = defaultCOnfig;
      const newConfig = _.merge(oldConfig, Config.all);
      const createConfig = ConfigEntity.create({
        key: label,
        value: newConfig,
      });
      // save config
      Config.set(newConfig);
      this.logger.info({ msg: "Create Config", oldConfig, newConfig });
      console.log("create config");

      await createConfig.save();
    }
  }
}
