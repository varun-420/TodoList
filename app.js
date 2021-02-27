const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://new_pathak20:varun-420@cluster0.22tlj.mongodb.net/todolistDB",{useNewUrlParser: true});
const itemsSchema = {
  name: String
};

const Item = mongoose.model("item",itemsSchema);

const item1 = new Item({
  name: "welcome to your todolist!"
});
const item2 = new Item({
  name: "Hit the + button for adding"
});
const item3 = new Item({
  name: "<-- hit this to delete an item"
});

const defaultsItems = [item1,item2,item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List",listSchema);


app.get("/", function(req, res) {

   Item.find({},function(err,foundItems){
   if(foundItems.length === 0)
   {
     Item.insertMany(defaultsItems, function(err){
       if(err)
       console.log(err);
       else
       console.log("successfully inserted dafault values!");
     });
     res.redirect("/");
   }
     else{
    res.render("list", {listTitle: "Today", newValue: foundItems});
  }
});

});

app.post("/", function(req,res){
     const itemName = req.body.newItem;
     const listName = req.body.button;
    const item = new Item({
      name: itemName
    });

    if(listName === "Today"){
      item.save();
      res.redirect("/");
    }
    else{
      List.findOne({name: listName},function(err,foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+listName);
      });
    }

});

app.post("/delete", function(req,res){
  const checkboxId = req.body.checkBox;

    Item.findByIdAndRemove(checkboxId, function(err){
      if(!err){
      console.log("successfully deleted the ckecked item");
      res.redirect("/");
    }
    });

});

app.get("/:customListName",function(req,res){
  const listName = _.capitalize(req.params.customListName);

List.findOne({name: listName}, function(err,foundList){
  if(!err){
    if(!foundList)
    {
      const list = new List({
        name: listName,
        items: defaultsItems
      });
      list.save();
      res.redirect("/"+listName);
    }
    else{
      res.render("list", {listTitle: foundList.name, newValue: foundList.items});
    }
  }
});

});
app.get("/work", function(req,res){
  res.render("list", {listTitle: "work list", newValue: workItems});
});

app.get("/about", function(req,res){
  res.render("about");
});
app.listen(3000, function() {
  console.log("server is running on port 3000");
})
