import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    email: {
      type: String,
      unique: true
    },
    password: String,
    image: String
  },
  {
    timestamps: true
  }
);
const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
