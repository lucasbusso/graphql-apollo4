import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.URI_SECRET
//[MONGOOSE] DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by 
//default in Mongoose 7. Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. 
//Or use `mongoose.set('strictQuery', true);` to suppress this warning.
mongoose.set('strictQuery', true)

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado');
}).catch(error => {
  console.log(error.message);
})

