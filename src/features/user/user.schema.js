import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [25, "Name can't be greater than 25 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+\@.+\../, "Please enter a valid email"],
  },
  password: {
    type: String,
    validate: {
      validator: function (value) {
        return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value);
      },
      message:
        "Password should be between 8-12 characters and include at least one special character ",
    },
  },
  type: { type: String, enum: ["customer", "seller"] },
});
