import express from 'express';
import cors from 'cors';
import routes from './router';
import mongoose from 'mongoose'
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://mongoso:1nf0rm4t1c4@geonosis.mongodb.umbler.com:48555/mongoso', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, () => {
    console.log('connected')
})




app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(routes)



app.listen(port, () => console.log("server running on port:" + port)); 