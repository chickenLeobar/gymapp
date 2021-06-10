import { UtilFIle } from "./../helpers/FileUtils";
import { Resource } from "./../entity/resouces/Resource";
import { Service } from "typedi";

import path from "path";
@Service()
export class StoreFileService {
  public deleteLocalFile(resource: Partial<Resource>) {
    return UtilFIle.deleteFile(path.resolve("uploads/" + resource.key));
  }
}
