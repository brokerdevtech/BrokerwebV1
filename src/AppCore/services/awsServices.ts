const AWS = require("aws-sdk");

// Set up your AWS configuration with access key and secret key
AWS.config.update({
  accessKeyId: "AKIAWRSHOUD5VCK4FIUL",
  secretAccessKey: "1BdcPRu4ZTYtfTjzkPxOdIn4lUNdmIuTL3gKXbY5",
  region: "ap-south-1",
});

const s3 = new AWS.S3();

export const GetAWSSignedURL = async (
  BucketName: string,
  imageName: string
) => {
  try {
    const params = {
      Bucket: BucketName,
      Key: imageName,
      Expires: 3600, // URL expiration time in seconds
    };
    console.log("params ", params);
    const signedUrl = s3.getSignedUrl("getObject", params);
    console.log("Signed URL: ", signedUrl);
    return signedUrl;
  } catch (error: any) {
    console.log("errr ", error);
    return {
      status: error.response.data.status,
      error: error.response.data.statusMessage || "An error occurred",
    };
  }
};
// Generate a signed URL for an image in your S3 bucket

export const uploadToS3 = async (
  BucketName: any,
  Key: any,
  Body: any,
  ContentType: any
) => {
  try {
    const params = {
      Bucket: BucketName,
      Key,
      Body,
      ContentType,
    };

    const uploadResult = await s3.upload(params).promise();
    console.log("Upload Result: ", uploadResult);

    return uploadResult.Location;
  } catch (error) {
    console.error("Error uploading to S3: ", error);
    throw error;
  }
};
