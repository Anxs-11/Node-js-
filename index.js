// // const http = require("http");
// // const myname = require("./features");
// import http from "http";
// // import myname from "./features.js"
// // import { myname, sisname, fathername } from "./features.js";
// // import * as obj from "./features.js"
// // console.log(obj);
// // console.log(obj.myname);
// // console.log(myname);
// // console.log(sisname);
// // console.log(fathername);


// import { lovegenerator } from "./features.js";
// // console.log(lovegenerator());

// import fs from "fs";

// // const home = fs.readFileSync("./index.html");
// const server = http.createServer((req, res) => {
//     // console.log(req.method);
//     if (req.url == "/about") {
//         res.end(`<h1>Random Love is : ${lovegenerator()}</h1>`)
//     }
//     else if (req.url == "/") {
//         fs.readFile("./index.html", (err, home) => {
//             res.end(home);
//         });
//         // res.end(home);
//     }
//     else if (req.url == "/contact") {
//         res.end("<h1>Contact</h1>")
//     }
//     else {
//         res.end("<h1>Page Not found</h1>")
//     }
// });
// server.listen(8000, () => {
//     console.log("Server is Running")
// });



// -----------------EXPRESS =-------------------
import express from "express"
import mongoose, { mongo } from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
}).then(() => console.log("Database Connected"))
    .catch(e => console.log(e));

// const messgschema = new mongoose.Schema({
//     name: String,
//     email: String,
// })

// const msg = mongoose.model("messages", messgschema)
import path from 'path';


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})
const usermodel = mongoose.model("User", userSchema)

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const decoded = jwt.verify(token, "wertgh");
        // console.log(decoded);
        req.User = await usermodel.findById(decoded._id);
        next();
    }
    else {
        res.render("login");
    }
};

app.get("/", isAuthenticated, (req, res) => {
    // res.send("Home")
    // res.sendStatus(404);
    // res.sendStatus(500);
    // res.json({
    //     success: true,
    //     Products: []
    // })
    // res.status(400).send("Hi this is separate message");
    // const pathloc = path.resolve(); // this gives current directory
    // const fileloc = path.join(pathloc, "index.html");
    // console.log(fileloc);
    // res.sendFile(fileloc); //to send html file on server
    // but this will send static file to send dynamic we use ejs 
    // res.render("index");
    // res.render("index", { name: "MOhd Anas" }); // this dyanmice
    // const { token } = req.cookies;
    // if (token) {
    //     res.render("logout"); // this
    // }
    // else {
    //     res.render("login"); // this
    // }
    // res.render("login"); // this dyanmice
    // as we can send data from here 

    // console.log(req.User);
    res.render("logout", { name: req.User.name });

    // res.sendFile(index)
})

app.get("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.redirect("/");
})
app.get("/login", (req, res) => {
    res.render("login");
})



// app.get("/success", (req, res) => {

//     res.render("success");
// });
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    let User = await usermodel.findOne({ email });
    if (User) {
        return res.redirect("/login")
    }
    const hashpas = await bcrypt.hash(password, 10);
    User = await usermodel.create({
        name,
        email,
        password: hashpas,
    })
    const token = jwt.sign({ _id: User._id }, "wertgh");
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000)
    });
    res.redirect("/");
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const User = await usermodel.findOne({ email });
    if (!User) {
        return res.redirect("/register");
    }
    // const ismatch = User.password === password;
    const ismatch = await bcrypt.compare(password, User.password);
    // console.log(ismatch);
    if (!ismatch) {
        return res.render("login", { email, message: "INCORRECT PASSWORD" });

    }

    const token = jwt.sign({ _id: User._id }, "wertgh");
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000)
    });
    res.redirect("/");
})
// app.post("/contact", async (req, res) => {
//     // console.log(req.body);
//     // console.log(req.body.email);
//     // user.push({ Name: req.body.name, Email: req.body.email });
//     // console.log(user);
//     // // res.render("success"); // show page content on same page
//     const { name, email } = req.body;
//     await msg.create({ name: name, email: email });
//     res.redirect("./success"); //takes to new page by calling app.get(success)
// })
// app.get("/user", (req, res) => {
//     res.json({
//         user,
//     })
// })
// app.get("/add", async (req, res) => {

//     res.send("Nice");


// });
app.listen(8000, () => {
    console.log("Server is Working");
})