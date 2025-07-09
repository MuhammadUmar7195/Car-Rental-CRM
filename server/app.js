import express from "express";
import connect from "./Config/connect.js";
import env from "dotenv";
import cookieParser from "cookie-parser";
const app = express();
env.config();

//Third-party middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 9000;
const database = process.env.MONGO_URI;

const start = () => {
    try {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        connect(database);
    } catch (error) {
        console.log(`Error starting the server: ${error.message}`);
    }
}

start();

//custom api routes
import adminRoutes from "./Routes/admin.route.js";
app.use("/api/v1/admin", adminRoutes);

//error handling middleware
import errorMiddleware from "./Middleware/error.js";
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send(`<center>Server is running ${port}</center>`);
});