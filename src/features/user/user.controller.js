import { UserModel } from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signUp(req, res) {
    const { name, email, password, type } = req.body;
    const hashedPassword = await bcrypt.hash(password, 16);
    const user = new UserModel(name, email, hashedPassword, type);
    await this.userRepository.signUp(user);
    res.status(201).send(user);
  }


  async signIn(req, res, next) {
    try {
      // 1. Find user by email
      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        // 2. Compare password with hashed password
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          // 3. Create token.
          const token = jwt.sign(
            {
              userID: user.id, // Corrected from result.id to user.id
              email: user.email, // Corrected from result.email to user.email
            },
            "e7jbb9ARMRTLqImldBRuX2iuW1tblDj9",
            {
              expiresIn: "1h",
            }
          );
          // 4. Send token
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (err) {
      console.log("err=============>", err);
      return res.status(500).send("Something went wrong");
    }
  }
  
}
