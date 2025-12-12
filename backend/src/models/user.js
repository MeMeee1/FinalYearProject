import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firstName: { type: DataTypes.STRING, allowNull: false }, // Admin won't need it
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
        name: 'unique_email',
        msg: 'Email already exists'
  }
},
 phoneNumber: { 
  type: DataTypes.STRING, 
  allowNull: false,
  unique: { name: "unique_phone", msg: "Phone already exists" } 
},

nin: { 
  type: DataTypes.STRING, 
allowNull: true,
  unique: { name: "unique_nin", msg: "NIN already exists" } 
},
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
 
  address: { type: DataTypes.STRING, allowNull: true },
  bankNumber: { type: DataTypes.STRING, allowNull: true },
  bankName: { type: DataTypes.STRING, allowNull: true },
  
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM("buyer", "seller", "admin"),
    defaultValue: "buyer",
  },
  clerkId:{
    type: DataTypes.STRING,
    allowNull: true, // make nullable so adding the column on existing DB won't create duplicate empty strings
    unique: true,
    defaultValue: null,
    comment: "Clerk User ID for integration with Clerk authentication"
  },
  imageUrl:{
    type: DataTypes.STRING,
    allowNull: true,
  },

  
});
