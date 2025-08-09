import Inventory from "../Model/inventory.model.js";
import ErrorHandler from "../Utils/ErrorHandler.js";

//Post the Inventory
export const postInventory = async (req, res, next) => {
    try {
        const { inventoryName, carModel, quantity, costPrice, sellingPrice } = req.body;

        if (!inventoryName || !carModel || quantity < 0 || costPrice < 0 || sellingPrice < 0) {
            return next(new ErrorHandler("All fields are required and must be valid", 400));
        }

        const newInventory = new Inventory({
            inventoryName,
            carModel,
            quantity,
            costPrice,
            sellingPrice
        });

        await newInventory.save();
        res.status(201).json({ message: "Inventory item added successfully", newInventory });
    } catch (error) {
        next(error);
    }
}

//Get All Inventories
export const getAllInventory = async (req, res, next) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json({ inventory });
    } catch (error) {
        next(error);
    }
}

//Get Single Inventory by ID
export const getSingleInventory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const inventoryItem = await Inventory.findById(id);
        if (!inventoryItem) {
            return next(new ErrorHandler("Inventory item not found", 404));
        }
        res.status(200).json({ inventoryItem });
    } catch (error) {
        next(error);
    }
}

//update the Inventory by ID
export const updateInventoryByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { inventoryName, carModel, quantity, costPrice, sellingPrice } = req.body;

        if (!inventoryName || !carModel || quantity < 0 || costPrice < 0 || sellingPrice < 0) {
            return next(new ErrorHandler("All fields are required and must be valid", 400));
        }

        const updatedInventory = await Inventory.findByIdAndUpdate(id, {
            inventoryName,
            carModel,
            quantity,
            costPrice,
            sellingPrice
        }, { new: true });

        if (!updatedInventory) {
            return next(new ErrorHandler("Inventory item not found", 404));
        }

        res.status(200).json({ message: "Inventory item updated successfully", updatedInventory });
    } catch (error) {
        next(error);
    }
}

//Delete Inventory by ID
export const deleteInventoryByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const inventoryItem = await Inventory.findByIdAndDelete(id);
        if (!inventoryItem) {
            return next(new ErrorHandler("Inventory item not found", 404));
        }
        res.status(200).json({ message: "Inventory item deleted successfully" });
    } catch (error) {
        next(error);
    }
}