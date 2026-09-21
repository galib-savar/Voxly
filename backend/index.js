import app from "./src/app.js";
import connectToDB from "./src/config/db/db.js";

connectToDB()

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});