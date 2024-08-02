import mongoose from "mongoose";
import { likeSchema } from './like.schema.js';
import { ObjectId } from "mongodb";
import { ApplicationError } from '../../error-handler/applicationError.js';

const LikeModel = mongoose.model("Like", likeSchema);
export class LikeRepository{

    async getLikes(type,id){
        return await LikeModel.find({
            likeable: new ObjectId(id),
            types:type
        }).populate('user').populate({ path:"likeable", model:type })
    }

    async likeProduct(userId, productId){
         try {
            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(productId),
                types:'Product'
            })
            await newLike.save()
         } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);    
         }
    }
    async likeCategory(userId, categoryId){
        try {
            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(categoryId),
                types:'Product'
            })
            await newLike.save()
         } catch (error) {
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
         }
    }
}