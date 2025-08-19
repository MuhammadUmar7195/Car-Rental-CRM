import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./Model/admin.model.js";
import FleetData from "./data/fleet_data.js";
import Fleet from "./Model/fleet.model.js";
import Customer from "./Model/customer.model.js";
import CustomerData from "./data/customer_data.js";
dotenv.config();

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminUser = await Admin.findOne({ role: "admin" });
        if (!adminUser) {
            console.error("No admin user found. Please create an admin user before seeding products.");
            process.exit(1);
        }

        // Optionally assign the admin user as the creator of each fleet
        const fleetData = FleetData.map(fleet => ({
            ...fleet,
            user: adminUser._id
        }));

        await Fleet.insertMany(fleetData);
        console.log("Fleet data seeded!");
        process.exit();
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

//function call to seed fleet data
// seedProducts();

const seedCustomer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminUser = await Admin.findOne({ role: "admin" });
        if (!adminUser) {
            console.error("No admin user found. Please create an admin user before seeding products.");
            process.exit(1);
        }

        // Optionally assign the admin user as the creator of each fleet
        const customerData = CustomerData.map(customer => ({
            ...customer,
            user: adminUser._id
        }));

        await Customer.insertMany(customerData);
        console.log("Customer data seeded!");
        process.exit();
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

//function call to seed customer data
// seedCustomer();