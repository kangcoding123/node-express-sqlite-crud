const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

(async () => {
  const Comments = sequelize.define("Comments", {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  await Comments.sync();
  console.log("The table for the Comments model was just (re)created!");

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set("view engine", "ejs");

  let comments = await Comments.findAll();
  console.log("Loaded comments:", comments);

  app.get("/", async (req, res) => {
    comments = await Comments.findAll();
    res.render("index", { comments });
  });

  app.post("/create", async (req, res) => {
    console.log("폼 데이터:", req.body.content);
    const { content } = req.body;
    await Comments.create({ content });
    comments = await Comments.findAll();
    console.log(comments);
    res.redirect("/");
  });

  app.post("/update/:id", async (req, res) => {
    const { content } = req.body;
    await Comments.update(
      { content },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    comments = await Comments.findAll();
    res.redirect("/");
  });

  app.post("/delete/:id", async (req, res) => {
    await Comments.destroy({
      where: {
        id: req.params.id,
      },
    });
    comments = await Comments.findAll();
    res.redirect("/");
  });

  app.listen(3000, () => {
    console.log("Server is listening on port 3000");
  });
})();
