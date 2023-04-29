const express = require('express');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(bodyParser.json());

const port = 9002;

mongoose.connect('mongodb+srv://karthikng:karthikng44@cluster0.zpsvxbb.mongodb.net/?retryWrites=true&w=majority',{
// mongoose.connect('mongodb://localhost:27017/loginsignup',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=>{
    console.log("Database Connected");
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    favorites: Array
})

const User = new mongoose.model("User", userSchema)

app.post('/login', (req, res)=>{
    const {email, password} = req.body;
    User.findOne({email: email}, (err, user)=>{
        if(user){
            if(password===user.password){
                res.send({message: "Successfully Logged in", user:user})
            }
            else{
                res.send({message:"Wrong Password"});
            }
        }
        else{
            res.send({message: "User not registered"})
        }
    })
});

app.post('/addfavorite', (req, res)=>{
  const {currentMovieDetail, user} = req.body;
  const usrid = user._id;
  User.updateOne({ _id: usrid }, { $push: { favorites: currentMovieDetail} }, (err, result) => {
      if (err) throw err;
    });
    res.send({message: "Added to your favorites"});
});

app.post('/rmfavorites', (req, res)=>{
   const {movie, user} = req.body;
   const usrid = user._id;
   console.log("At least it's clicking");
   User.updateOne({_id: usrid}, {$pull:{favorites: movie} }, (err, result)=>{
     if(err) throw err;
   });
   res.send({message: "Removed from favorites"});
});


app.post('/fetchfavorites', (req, res)=>{
  console.log("At least clicking")
  const {user}= req.body;
  const usrid = user._id;
   User.findOne({_id:usrid}, (err, user)=>{
    if(user){
    res.send({message: user.favorites})
    console.log(user.favorites);
  }
  else{
    res.send({message: "No favorites"});
  }
});
});

// app.post('/fetchfavorites1', (req, res)=>{
//   const usrid = "63f62325abe358e385209e33";
//   User.findOne({_id:usrid}, (err, user)=>{
//     if(user){
//     res.send({message: user.favorites})
//     // console.log(user.favorites);
//   }
//   else{
//     res.send({message: "No favorites"});
//   }
// });
// });


app.post('/register', (req, res)=>{
    const {name, email, password} = req.body;
    User.findOne({email:email}, (err, user)=>{
        if(user){
            res.send({message: "User already Exists"})
        }
        else{
            const user = new User({
                name,
                email,
                password
            })
            user.save(err=>{
                if(err)
                res.send(err);
                else{
                    res.send({message: "Successfully Registered"});
                }
            })
        }
    })
})
app.listen(port,  ()=>{
    console.log('API started on port 9002');
});


// mongodb+srv://movieapp:movieapp123@karthik.yyvbipq.mongodb.net/?retryWrites=true&w=majority
