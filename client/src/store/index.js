import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/auth.slice.js';
import fleetReducer from './Slices/fleet.slice.js';
import customerReducer from './Slices/customer.slice.js';
import rentalReducer from './Slices/rental.slice.js';
import AccountingReducer from './Slices/accouting.slice.js';
import InventoryReducer from './Slices/inventory.slice.js';
import ServiceReducer from './Slices/service.slice.js';

// Configure the Redux store with the slices
export const store = configureStore({
  reducer: {
    auth: authReducer,
    fleet: fleetReducer,
    customer: customerReducer,
    rental: rentalReducer,
    accounting: AccountingReducer,
    inventory: InventoryReducer,
    service: ServiceReducer,
  },
})