import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
{
  page:{
    type:String,
    required:true,
    unique:true
  },

  title:String,
  description:String,
  keywords:String,

  // Open Graph
  ogTitle:String,
  ogDescription:String,
  ogImage:String,

  // optional
  canonicalUrl:String,

  updatedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Admin"
  }

},
{timestamps:true}
);

export default mongoose.model("Seo",seoSchema);