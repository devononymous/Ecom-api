import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

// creating model from schema
const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async resetPassword(userID, hashedPassword) {
    try {
      let user = await UserModel.findById(userID);
      console.log("user ===>", user);
      if (!user) {
        throw new Error("No such user found");
      } else {
        user.password = hashedPassword;
        user.save();
      }
    } catch (error) {
      console.log("error in reset password repository ====>", error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async signUp(user) {
    // create instance of model.
    try {
      const newUser = new UserModel(user);
      await newUser.save();
    } catch (error) {
      console.log("error in signup validation ===>", error)
      if (error instanceof mongoose.Error.ValidationError) {
        throw error;
      } else {
        console.log(error);
        throw new ApplicationError("Something went wrong with database", 500);
      }
    }
  }

  async signIn(email, password) {
    try {
      await UserModel.findOne({ email, password });
    } catch (error) {
      console.log("error in signing in====>", error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  async findByEmail(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
