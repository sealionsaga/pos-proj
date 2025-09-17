"use client";

import { useState, useContext } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CartContext } from "@/context/CartContext";
import { Product } from "@/types";

export default function POSPage() {
  const products = useQuery(api.products.getProducts);
  const addTransaction = useMutation(api.transactions.addTransaction);
  const { user } = useUser();
  const context = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  if (!context) return null;
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = context;

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, quantity);
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    const productIds = cart.map(item => item.product._id as Id<"products">);
    const quantities = cart.map(item => item.quantity);
    const totalAmount = total;
    const cashierId = user?.id || "anonymous";
    await addTransaction({ productIds, quantities, totalAmount, paymentMethod, cashierId });
    alert(`Transaction completed! Total: $${total.toFixed(2)}, Payment: ${paymentMethod}`);
    clearCart();
  };

  if (!products) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedProduct?._id || ""} onValueChange={(value) => {
                const product = products.find(p => p._id === value);
                setSelectedProduct(product || null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name} - ${product.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  min="1"
                />
              </div>
              <Button onClick={handleAddToCart} disabled={!selectedProduct}>Add to Cart</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cart</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex justify-between items-center">
                    <span>{item.product.name} x{item.quantity}</span>
                    <div>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</Button>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</Button>
                      <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.product._id)}>Remove</Button>
                    </div>
                  </div>
                ))}
                <div className="font-bold">Total: ${total.toFixed(2)}</div>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCheckout} disabled={cart.length === 0 || !paymentMethod}>Checkout</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
