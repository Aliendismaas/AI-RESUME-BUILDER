import mongoose from 'mongoose'

const connectDB= async () => {
    try {
        mongoose.connection.on("connected",()=> {console.log("Database connected Successfully")})
        let mongo_url = process.env.MONGO_URL
        const project_name = 'resume-bulder'

        if(!mongo_url){
            throw new Error("MONGO_URL environmental variable not set")            
        }

        if(!mongo_url.endsWith('/')){
            mongo_url = mongo_url.slice(0, -1)
        }

        await mongoose.connect(`${mongo_url}/${project_name}`)
    } catch (error) {
        console.log("Error connecting to MongoDB: ",error);
        
    }
}

export default connectDB;