const express = require("express");
const app= express();
const path = require("path");
const fs = require("fs");

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
    fs.readdir("./hisaab",(err,files)=>{
        if(err) return res.status(500).send("Error reading directory");
        res.render("index",{files: files});
    });
});

app.get("/create",(req,res)=>{
    res.render("create");
});

app.post("/update/:title",(req,res)=>{
    fs.writeFile(`./hisaab/${req.params.title}`, req.body.content, (err) => {
        if (err) return res.status(500).send("Error updating file");
        res.redirect(`/hisaab/${req.params.title}`);
    });
});

app.get("/edit/:title",(req,res)=>{
    fs.readFile(`./hisaab/${req.params.title}`, "utf8", (err, data) => {
        if (err) return res.status(404).send(err);
        res.render("edit", { title: req.params.title, content: data });
    });
});

app.get("/hisaab/:title",(req,res)=>{
    fs.readFile(`./hisaab/${req.params.title}`, "utf8", (err, data) => {
        if (err) return res.status(404).send(err);
        res.render("hisaab", { title: req.params.title, content: data });
    });
});

app.get("/delete/:title",(req,res)=>{
    fs.unlink(`./hisaab/${req.params.title}`, (err) => {
        if (err) return res.status(500).send("Error deleting file");
        res.redirect("/");
    }); 
}
);

app.post("/createhisaab",(req,res)=>{
    fs.writeFile(`./hisaab/${req.body.title}.txt`, req.body.content, (err) => {
        if (err) return res.status(500).send("Error creating file");
        res.redirect("/");
    }); 
});

app.listen(3000,function () {
    console.log("Server is running on port 3000");
});