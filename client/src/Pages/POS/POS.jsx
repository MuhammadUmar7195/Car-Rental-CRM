import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FaCashRegister, 
  FaShoppingCart, 
  FaCar, 
  FaSearch,
  FaPlus,
  FaMinus,
  FaTimes
} from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const POS = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dummy data for cars
  const cars = [
    { id: 1, carName: 'Toyota Corolla', registration: 'ABC-1234', model: '2020' },
    { id: 2, carName: 'Honda Civic', registration: 'XYZ-5678', model: '2021' },
    { id: 3, carName: 'BMW X5', registration: 'BMW-9999', model: '2022' },
    { id: 4, carName: 'Mercedes C-Class', registration: 'MER-7777', model: '2023' },
  ];

  // Dummy inventory data
  const inventory = [
    { id: 1, name: 'Engine Oil', category: 'Lubricants', price: 2500, stock: 50, image: '🛢️' },
    { id: 2, name: 'Brake Pads', category: 'Brake System', price: 4500, stock: 25, image: '🔧' },
    { id: 3, name: 'Air Filter', category: 'Filters', price: 1200, stock: 100, image: '🔲' },
    { id: 4, name: 'Spark Plugs', category: 'Engine', price: 800, stock: 75, image: '⚡' },
    { id: 5, name: 'Tire Set', category: 'Tires', price: 25000, stock: 20, image: '🛞' },
    { id: 6, name: 'Battery', category: 'Electrical', price: 8500, stock: 15, image: '🔋' },
    { id: 7, name: 'Windshield Wipers', category: 'Accessories', price: 1500, stock: 40, image: '🧽' },
    { id: 8, name: 'Coolant', category: 'Fluids', price: 900, stock: 60, image: '🧪' },
  ];

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-purple-700">
            <FaCashRegister className="text-purple-600" />
            Point of Sale (POS)
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Car Reference Section */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FaCar className="text-blue-600" />
            Car Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cars.map((car) => (
              <Card
                key={car.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCar?.id === car.id
                    ? 'ring-2 ring-purple-500 bg-purple-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCar(car)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800">{car.carName}</h3>
                  <p className="text-sm text-gray-600">{car.registration}</p>
                  <p className="text-xs text-gray-500">Model: {car.model}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {selectedCar && (
            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <p className="text-sm font-medium text-purple-800">
                Selected: {selectedCar.carName} ({selectedCar.registration})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Inventory Section */}
        <div className="lg:col-span-3">
          <Card className="bg-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Inventory Items</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <DialogTrigger asChild>
                    <Button className="relative bg-purple-600 hover:bg-purple-700">
                      <FaShoppingCart className="mr-2" />
                      Cart
                      {getTotalItems() > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                          {getTotalItems()}
                        </Badge>
                      )}
                    </Button>
                  </DialogTrigger>
                  
                  {/* Cart Dialog */}
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FaShoppingCart className="text-purple-600" />
                        Shopping Cart
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {cart.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Your cart is empty</p>
                      ) : (
                        <>
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.image}</span>
                                <div>
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-gray-600">{item.category}</p>
                                  <p className="text-sm font-semibold">Rs {item.price}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <FaMinus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <FaPlus className="w-3 h-3" />
                                  </Button>
                                </div>
                                
                                <div className="text-right min-w-[80px]">
                                  <p className="font-semibold">Rs {item.price * item.quantity}</p>
                                </div>
                                
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <FaTimes className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          
                          <Separator />
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-lg font-semibold">
                              <span>Total Amount:</span>
                              <span>Rs {getTotalAmount().toLocaleString()}</span>
                            </div>
                            
                            {selectedCar && (
                              <div className="p-3 bg-purple-100 rounded-lg">
                                <p className="text-sm font-medium text-purple-800">
                                  For: {selectedCar.carName} ({selectedCar.registration})
                                </p>
                              </div>
                            )}
                            
                            <div className="flex gap-3">
                              <Button 
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  alert('Sale completed successfully!');
                                  setCart([]);
                                  setIsCartOpen(false);
                                }}
                              >
                                Complete Sale
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setCart([])}
                              >
                                Clear Cart
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredInventory.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="text-center mb-3">
                        <span className="text-4xl">{item.image}</span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                      <p className="text-lg font-bold text-purple-600 mb-2">Rs {item.price}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={item.stock > 10 ? "default" : "destructive"}>
                          Stock: {item.stock}
                        </Badge>
                      </div>
                      
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => addToCart(item)}
                        disabled={item.stock === 0}
                      >
                        <FaPlus className="mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-md sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FaShoppingCart className="text-purple-600" />
                Cart Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-semibold">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-bold text-lg">Rs {getTotalAmount().toLocaleString()}</span>
                </div>
                
                <Separator />
                
                {selectedCar && (
                  <div className="p-2 bg-purple-100 rounded text-sm">
                    <p className="font-medium text-purple-800">Reference Car:</p>
                    <p className="text-purple-700">{selectedCar.carName}</p>
                    <p className="text-purple-600">{selectedCar.registration}</p>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => setIsCartOpen(true)}
                  disabled={cart.length === 0}
                >
                  View Cart ({getTotalItems()})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default POS;
