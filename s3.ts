const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
require("dotenv").config({ path: __dirname + "/.env" });

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

interface iFile {
  path: string;
  filename: string;
}

class Aws {
  s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
  });

  uploadFile = (file: iFile) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };

    return this.s3.upload(uploadParams).promise();
  };

  getFileStream = (fileKey: string) => {
    const downloadParams = {
      Bucket: bucketName,
      Key: fileKey,
    };

    return this.s3.getObject(downloadParams).createReadStream();
  };

  deleteFileStream = (fileKey: string) => {
    const deleteParams = {
      Bucket: bucketName,
      Key: fileKey,
    };

    return this.s3.deleteObject(deleteParams).promise();
  };

  editFileStream = (fileKey: string, file: iFile) => {
    const deleteParams = {
      Bucket: bucketName,
      Key: fileKey,
    };

    this.s3.deleteObject(deleteParams);
    return this.uploadFile(file);
  };
}

module.exports = new Aws();
