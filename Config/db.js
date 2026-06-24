import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🚀 MongoDB Conectado exitosamente');
    } catch (error) {
        console.log("❌ Error al conectar a MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;