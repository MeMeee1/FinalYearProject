import dotenv from 'dotenv';

dotenv.config();

export const ENV={
    NODE_ENV:process.env.NODE_ENV,
    PORT:process.env.PORT,
   
    MYSQL_HOST:process.env.MYSQL_HOST,
    MYSQL_USER:process.env.MYSQL_USER,
    MYSQL_PASSWORD:process.env.MYSQL_PASSWORD,
    MYSQL_DB:process.env.MYSQL_DB,
    CLERK_PUBLISHABLE_KEY:process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY,
    INGEST_SIGNING_KEY:process.env.INGEST_SIGNING_KEY,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
}