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

//update walk-in service status
export const updateWalkInServiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return next(new ErrorHandler("Status is required", 400));
    }

    const walkInServiceOrder = await WalkInServiceOrder.findByIdAndUpdate(id, { status }, { new: true });

    if (!walkInServiceOrder) {
      return next(new ErrorHandler("Walk-in service order not found", 404));
    }

    res.status(200).json({
      message: "Walk-in service order status updated successfully",
      walkInServiceOrder
    });
  } catch (error) {
    next(error);
  }
}

// Walk-in delete by their ID service
export const deleteByIdService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedService = await WalkInServiceOrder.findByIdAndDelete(id);

    if (!deletedService) {
      return next(new ErrorHandler("Service order not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Walk-in service order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
