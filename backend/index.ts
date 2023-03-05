import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path:"./config/config.env"});
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Test Successful");
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});