import {Sequelize} from 'sequelize';
import { ENV } from "./env.js";
import dotenv from 'dotenv';
dotenv.config();
export const sequelize = new Sequelize(
    ENV.MYSQL_DB,
    ENV.MYSQL_USER,
    ENV.MYSQL_PASSWORD,
    {
    
        host: ENV.MYSQL_HOST, 
        dialect: 'mysql',
    }
);
export const connectDB = async () => {
  try{
    await sequelize.authenticate();
    console.log("MySQL connected");
  }
  catch(error){
    console.log("MySQL connection error");
    console.log(error);
    process.exit(1);
  }
}