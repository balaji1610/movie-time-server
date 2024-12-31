const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

app.get("/protected", async (req, res) => {
  res.json({
    message: "You have access to this protected route",
    user: req.user,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
