import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

let users = [
  {
    id: 1,
    name: "Seller User",
    email: "seller@com.com",
    password: "pass1",
    type: "seller",
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@com.com",
    password: "pass2",
    type: "seller",
  },
];
export class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }
  


 

  static getAll() {
    return users;
  }
}
