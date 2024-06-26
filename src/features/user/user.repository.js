import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";



class UserRepository {
  constructor(){
    this.collection = "users"
  }
    async signUp(newUser) {
        try {
          //  1. Get the database
          const db = getDB();
          // 2. Get the collection
          const collection = db.collection(this.collection);
          console.log(" models newUser=>", newUser);
          //3. Insert the document
          await collection.insertOne(newUser);
          return newUser;
        } catch (err) {
          console.log("err=>",err)
          throw new ApplicationError("Something went wrong with database",503);
        }
      }

    async signIn(email,password) {
        try {
          //  1. Get the database
          const db = getDB();
          // 2. Get the collection
          const collection = db.collection(this.collection);
          console.log(" verify userUser=>", email,password);
          //3. find the document
          return  await collection.findOne({email,password});
        
        } catch (err) {
          console.log("err=>",err)
          throw new ApplicationError("Something went wrong with database",503);
        }
      }
    async findByEmail(email) {
        try {
          //  1. Get the database
          const db = getDB();
          // 2. Get the collection
          const collection = db.collection(this.collection);
          console.log(" verify userUser=>", email);
          //3. find the document
          return  await collection.findOne({email});
        
        } catch (err) {
          console.log("err=>",err)
          throw new ApplicationError("Something went wrong with database",503);
        }
      }

      
    


}


export default UserRepository