import express from 'express';
import cors from 'cors';
import routes from './router';
import mongoose from 'mongoose'
const port = process.env.PORT || 3000;
const app = express();



mongoose.connect('mongodb://mongoso:1nf0rm4t1c4@geonosis.mongodb.umbler.com:48555/mongoso', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, () => {
    console.log('connected')
})

app.use(cors());
app.use(express.json());
app.use(routes)



app.listen(port, () => console.log("server running on port:" + port)); 