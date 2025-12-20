const express = require("express");
const app = express();
const port = 3000;

// Données d'exemple (à personnaliser)
const projects = [
  {
    id: 1,
    title: "Œuvre 1",
    description: "Description de l’œuvre 1",
    image: "/images/landscape_of_the_four_seasons.jpg",
  },
  {
    id: 2,
    title: "Œuvre 2",
    description: "Description de l’œuvre 2",
    image: "/images/intro.png",
  }
];

// API qui renvoie les projets
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// Servir le frontend
app.use(express.static("frontend"));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
