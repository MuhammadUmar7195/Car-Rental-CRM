import connect from "./Config/connect.js";
import cookieParser from "cookie-parser";
import express from "express";
import env from "dotenv";
import cors from "cors";
const app = express();
env.config();

//Third-party middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

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
import fleetRoutes from "./Routes/fleet.routes.js";
import customerRoutes from "./Routes/customer.route.js";
import RentalRoutes from "./Routes/rental.route.js";
import AccountingRoutes from "./Routes/accounting.route.js";

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/fleet", fleetRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/rental", RentalRoutes);
app.use("/api/v1/accounting", AccountingRoutes);

//error handling middleware
import errorMiddleware from "./Middleware/error.js";
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send(`<center>Server is running ${port}</center>`);
});