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
    try {
      // create instance of model.
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        throw err;
      } else {
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);
      }
    }
  }

  async signIn(email, password) {
    try {
      return await UserModel.findOne({ email, password });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async updateUser(user) {
    await UserModel.updateOne({ email: user.email }, { password: user.password });
  }
}
