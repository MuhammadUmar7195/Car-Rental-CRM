import Fleet from '../Model/fleet.model.js';
import Inventory from '../Model/inventory.model.js';
import ServiceOrder from '../Model/service.model.js';
import ErrorHandler from '../Utils/ErrorHandler.js';

export const createServiceOrder = async (req, res, next) => {
  try {
    const { carId, itemsUsed, description, servicedBy } = req.body;

    if (!carId || !itemsUsed || !Array.isArray(itemsUsed) || itemsUsed.length === 0) {
      return next(new ErrorHandler("Missing required fields", 400));
    }

    // check car is exist or not
    const car = await Fleet.findById(carId);
    if (!car) {
      return next(new ErrorHandler("Car not found", 404));
    }

    let totalCost = 0;

    // Validate inventory items and calculate cost
    const processedItems = [];
    
    for (const item of itemsUsed) {
      const inventoryItem = await Inventory.findById(item.inventoryItem);
      if (!inventoryItem) {
        return next(new ErrorHandler("Inventory item not found", 404));
      }
      // check krna ha ka avialable stock sa kam toh nhi ha quantity
      if (inventoryItem.quantity < item.quantityUsed) {
        return next(new ErrorHandler(`Not enough stock for item: ${inventoryItem.carName}`, 400));
      }

      totalCost += item.quantityUsed * inventoryItem.sellingPrice;

      // Decrease stock
      inventoryItem.quantity -= item.quantityUsed;
      await inventoryItem.save();

      // Store processed item data in Array one by one
      processedItems.push({
        inventoryItem: item.inventoryItem,
        quantityUsed: item.quantityUsed,
        unitPrice: inventoryItem.sellingPrice,
        totalPrice: item.quantityUsed * inventoryItem.sellingPrice,
        itemName: inventoryItem.carName, 
        itemModel: inventoryItem.carModel 
      });
    }

    const serviceOrder = new ServiceOrder({
      car: carId,
      itemsUsed: processedItems,
      totalCost,
      description,
      servicedBy
    });

    await serviceOrder.save();
    
    // Populate the response
    await serviceOrder.populate('car itemsUsed.inventoryItem');

    res.status(201).json({ 
      success: true,
      message: 'Service order created successfully', 
      serviceOrder 
    });
  } catch (error) {
    next(error);
  }
};
