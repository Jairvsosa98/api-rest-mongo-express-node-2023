
import mongoose from "mongoose";

try {
    await mongoose.connect(process.env.URI_MONGO);
    console.log("Connect DB Ok ✌");
} catch (error) {
    console.log("Error de conexión a mongodb:"+error);
}