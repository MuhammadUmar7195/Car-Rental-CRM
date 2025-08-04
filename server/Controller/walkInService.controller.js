import WalkInServiceOrder from "../Model/walkInService.model.js";
import ErrorHandler from "../Utils/ErrorHandler.js";

// Walk-in service order creation
export const walkInServiceFleet = async (req, res, next) => {
  try {
    const {
      customerName,
      phone,
      carModel,
      carRegistrationNumber,
      itemsUsed,
      totalCost,
      description,
      servicedBy,
      status,
    } = req.body;

    if (
      !customerName ||
      !carModel ||
      !carRegistrationNumber ||
      !itemsUsed ||
      !servicedBy ||
      !status ||
      typeof totalCost !== "number"
    ) {
      return next(new ErrorHandler("All required fields must be provided", 400));
    }

    const serviceOrder = new WalkInServiceOrder({
      customerName,
      phone,
      carModel,
      carRegistrationNumber,
      itemsUsed,
      totalCost,
      description,
      servicedBy,
      status,
    });

    await serviceOrder.save();

    res.status(201).json({
      success: true,
      message: "Walk-in service order created successfully",
      newService: serviceOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Walk-in get all service 
export const getAllWalkInServices = async (req, res, next) => {
  try {
    const serviceOrders = await WalkInServiceOrder.find().populate('itemsUsed.inventoryItem');
    res.status(200).json({ serviceOrders });
  } catch (error) {
    next(error);
  }
};
