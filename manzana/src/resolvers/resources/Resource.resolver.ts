import { PrevDataResource } from "./../../types/Response";
import { StoreFileService } from "./../../services/file.service";
import { Repository } from "typeorm";
import path from "path";
import { Upload } from "./../user/UserResolver";
import { GraphQLUpload } from "graphql-upload";
import { Resource } from "./../../entity/resouces/Resource";
import { ManageCodes } from "./../../config/codes";
import { ResourceResponse } from "./../../types/events/response";
import { v4 as uuid } from "uuid";
import { createWriteStream } from "fs";
import {
  Arg,
  FieldResolver,
  Int,
  Mutation,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import sharp from "sharp";

import configStore from "../../config/configstore";

import { InputResource } from "../../types/events/Even.input";
import { s3 } from "../../config/aws";
import { deleteObject } from "../../config/aws";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
@Resolver((type) => Resource)
@Service()
export class ResourceResolver implements ResolverInterface<Resource> {
  constructor(
    @InjectRepository(Resource) private resourceRepo: Repository<Resource>,
    private fileService: StoreFileService
  ) {}

  @Mutation((type) => Resource)
  async createResource(@Arg("resource") inputResource: InputResource) {
    const resource = Resource.create(inputResource);
    return await resource.save();
  }
  @Mutation((type) => ResourceResponse)
  async editResource(
    @Arg("idResource", (type) => Int) idResource: number,
    @Arg("resource") inputResource: InputResource
  ): Promise<ResourceResponse> {
    const bdResource = await Resource.findOne({ id: idResource });
    if (!bdResource) {
      return {
        resp: false,
        errors: [ManageCodes.searchError(13)],
      };
    }
    if (inputResource.instace == "S3") {
      await deleteObject({
        Bucket: bdResource.bucket,
        Key: bdResource.key,
      });
    } else {
      this.fileService.deleteLocalFile(bdResource);
    }
    const objectUpdate = Resource.merge(bdResource, inputResource);
    await Resource.update(idResource, objectUpdate);
    return {
      resp: true,
      resource: objectUpdate,
    };
  }

  /*=============================================
 =            EDIT RESOURCE            =
 =============================================*/
  /*=============================================
=            ADD LOCAL RESOURCE            =
=============================================*/
  @Mutation((type) => PrevDataResource)
  async addLocalResource(
    @Arg("file", () => GraphQLUpload) { createReadStream, filename }: Upload,
    @Arg("compress", () => Boolean, { nullable: true, defaultValue: true })
    compress: boolean
  ) {
    const relativePath = `${configStore.get(
      "directories.resource"
    )}/${uuid()}.${configStore.get("file.extDefault")}`;

    const route = path.resolve("uploads/" + relativePath);
    const saveFile = new Promise(async (resolve, reject) => {
      let stream = createReadStream();
      if (compress) {
        const transform = sharp()
          .resize({
            width: Number(configStore.get("file.imageSize")),
          })
          .webp();
        stream.pipe(transform);
      }
      stream
        .pipe(createWriteStream(route))
        .on("finish", async () => {
          return resolve({ key: relativePath, instance: "LOCAL" });
        })
        .on("error", (err) => {
          return reject(err);
        });
    });

    return await saveFile;
  }
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property

  @FieldResolver()
  async url(@Root() resource: Resource) {
    try {
      if (resource.instace == "S3") {
        const url = await s3.getSignedUrlPromise("getObject", {
          Bucket: resource.bucket,
          Key: resource.key,
          Expires: 40 * 60,
        });
        return url;
      } else {
        return resource.key;
      }
    } catch (error) {
      return "";
    }
  }
}
