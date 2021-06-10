import * as Aws from "aws-sdk";
export const s3 = new Aws.S3({
  signatureVersion: "v4",
  region: "fra1",
  endpoint: new Aws.Endpoint("fra1.digitaloceanspaces.com"),
  credentials: new Aws.Credentials({
    secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
    accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
  }),
});

export const deleteObject = (props: { Bucket: string; Key: string }) => {
  return new Promise((resolve, reject) => {
    s3.deleteObject({ Bucket: props.Bucket, Key: props.Key }, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

/**
 *
 * References : 
 * // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html


 *
 */

// const file = path.resolve(__dirname, "hola.png");
// const body = fs.createReadStream(file);

//   {
//     Bucket: "wellnesspro",
//     Body: body,
//     Key: "mifile.png",
//     ACL: "public-read",
//   },
//   (err, data) => {
//     if (err) {
//       console.log("error");
//       console.log(err);
//     }
//     if (data) {
//       console.log(data);
//     }
//   }
// );
/**
 *
 * generate url presuignned URl
 * REFERENCES :
 *  https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property
 *
 */
// const promise = s3.getSignedUrlPromise("getObject", {
//   Bucket: BUCKET,
//   Key: "mifile.png",
//   Expires: 60000000,
// });

// promise.then((data) => {
//   console.log(data);
// });

// s3.listBuckets((err, res) => {
//   console.log(res);
// });

// s3.listObjects({ Bucket: "wellnesspro" }, (err, data) => {
//   console.log(err);
//   data.Contents?.forEach((el) => {
//     console.log(el.Owner);
//     console.log(el);
//   });
// });

// s3.getBucketAcl({ Bucket: BUCKET }, (err, data) => {
//   console.log(err);
//   if (data) {
//     console.log("data exists");
//     console.log(data);
//   }
// });
