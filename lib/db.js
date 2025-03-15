import mongoose from "mongoose";
const {NAME,PASSWORD,DB_NAME,CLUSTER}=process.env;
const Uri="mongodb+srv://"+NAME+":"+PASSWORD+"@mycluster.n7kqq.mongodb.net/"+DB_NAME+"?retryWrites=true&w=majority&appName="+CLUSTER

export default async function connecting() {
    if (mongoose.connection.readyState === 1) {
        console.log("#  -- Already connected to database  --#");
        return;
    }
    try {
        await mongoose.connect(Uri);
        console.log("Database connection successful");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}
