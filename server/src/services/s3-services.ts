import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

interface S3Response {
  Location: string;
}

const uploadImage = (fileBuffer: Buffer, filename: string, mimetype: string): Promise<S3Response> => {
  const s3Params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `${Date.now()}-${filename}`,
    Body: fileBuffer,
    ContentType: mimetype,
  };
  return s3.upload(s3Params).promise();
};

export { uploadImage };
