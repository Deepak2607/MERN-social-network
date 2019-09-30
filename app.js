const express= require('express');
const morgan= require('morgan');
const mongoose= require("mongoose");
const bodyParser= require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv= require('dotenv');
dotenv.config();
//const upload= require('express-fileupload');
//const path= require('path');
//const methodOverride= require('method-override');
//const session= require('express-session');
//const flash= require('connect-flash');



//importing routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
//const userRoutes = require('./routes/user');

const app= express();
const PORT= process.env.PORT || 3000;




//mongoose-driver
mongoose.Promise= global.Promise;
mongoose.connect('mongodb://localhost:27017/socialNetwork',{ useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true,  useUnifiedTopology: true  }).then((db)=> {
    console.log('MONGO connected');
}).catch((error)=> {
    console.log("error");
})


//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//cookie-parser
app.use(cookieParser());


//morgan middleware..it is used to see requests
app.use(morgan('dev'));



//routes middleware
app.use('/post', postRoutes);
app.use('/auth', authRoutes);
//app.use('/api', userRoutes);



app.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT}`);
})










//you know why dev is used in package.json... npm run dev -> nodemon app.js