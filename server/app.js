import rateLimit from "express-rate-limit";
import connect from "./Config/connect.js";
import cookieParser from "cookie-parser";
import express from "express";
import env from "dotenv";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

const app = express();
env.config();

//Third-party middleware
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
            connectSrc: ["'self'", process.env.FRONTEND_URL, process.env.CUSTOMER_PORTAL_URL].filter(Boolean),
            frameAncestors: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    referrerPolicy: { policy: "no-referrer" },
    noSniff: true,
    frameguard: { action: "deny" },
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.CUSTOMER_PORTAL_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// To prevent NoSQL injection attacks
app.use((req, res, next) => {
    if (req.body) {
        mongoSanitize.sanitize(req.body);
    }
    next();
});


// Rate limiting: 80 requests per minute per IP
app.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 80,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later."
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
import AdminRoutes from "./Routes/admin.route.js";
import UserRoutes from "./Routes/user.route.js";
import FleetRoutes from "./Routes/fleet.routes.js";
import CustomerRoutes from "./Routes/customer.route.js";
import RentalRoutes from "./Routes/rental.route.js";
import AccountingRoutes from "./Routes/accounting.route.js";
import InventoryRoutes from "./Routes/inventory.route.js";
import ServiceRoutes from "./Routes/service.route.js";
import WalkInServiceRoutes from "./Routes/walkInService.route.js";
import UploadCar from "./Routes/uploadCar.route.js";
import WorkshopRoutes from "./Routes/workshop-appointment.route.js";
import ContactRoutes from "./Routes/contact-form.route.js";

app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/fleet", FleetRoutes);
app.use("/api/v1/customer", CustomerRoutes);
app.use("/api/v1/rental", RentalRoutes);
app.use("/api/v1/service", ServiceRoutes);
app.use("/api/v1/walkinService", WalkInServiceRoutes);
app.use("/api/v1/accounting", AccountingRoutes);
app.use("/api/v1/inventory", InventoryRoutes);
app.use("/api/v1/upload", UploadCar);
app.use("/api/v1/workshop", WorkshopRoutes);
app.use("/api/v1/contact", ContactRoutes);

//error handling middleware
import errorMiddleware from "./Middleware/error.js";
app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.send(`<center>Welcome to KonceptNext Car Management</center>`);
});