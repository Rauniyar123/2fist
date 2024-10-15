/*...............import dependancies..............*/
const express=require("express");
const app=express();
const bodyParser = require("body-parser");
const cors=require("cors");
const path=require("path");







/*................built-in express middleware............*/
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended:false,limit: '50mb' }));
app.use(bodyParser.json());


  // Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  
];

// Configure CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'token'] // Allow these headers
}));



// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'Error' && err.message === 'Not allowed by CORS') {
    res.status(403).json({ message: 'CORS error: Not allowed by CORS' });
  } else {
    next(err);
  }
});




/*................routes express middleware..............*/
const user_routes=require("./routers/user_routers");

app.use("/user/api",user_routes);



/*................third party express middleware..........*/
app.use('/uploads', express.static('uploads'));
const filePath = path.join(__dirname, '/uploads');
app.set(path.join(__dirname, '/uploads'));


/*................error-handler middleware.................*/
app.use((err,req,res,next)=>{
	res.status(404).json({error:err.message});

});



//exports app file from here
module.exports=app;


