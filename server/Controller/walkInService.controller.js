import WalkInServiceOrder from "../Model/walkInService.model.js";
import ErrorHandler from "../Utils/ErrorHandler.js";

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
      message: "Walk-in service order created successfully"
    });
  } catch (error) {
    next(error);
  }
};
