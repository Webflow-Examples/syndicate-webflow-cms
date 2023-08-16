const express = require("express");
const app = express();
const webflowSyndicationRouter = require("./webflowSyndicationRouter");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");

app.use(express.json());

// Middleware
app.use((req, res, next) => {
  // This is a simple logging middleware for demonstration purposes.
  console.log(`${req.method} ${req.url}`);
  next(); // Move on to the next middleware/route.
});

// Routes
app.use("/", webflowSyndicationRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
