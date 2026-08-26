import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isOpen) return null;

  const totalItemsCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);
  const subtotal = cartItems.reduce((acc, c) => acc + c.price * c.quantity, 0);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 35;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      onClearCart();
      setOrderPlaced(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#141820] text-white flex flex-col justify-between p-6 border-l border-white/10 shadow-2xl relative animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-600/20 text-rose-400 rounded-xl border border-rose-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Your Food Basket</h2>
              <p className="text-xs text-gray-400 font-mono">{totalItemsCount} items selected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Placed Success View */}
        {orderPlaced ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-white">Intent Order Confirmed!</h3>
            <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
              Your meal order has been dispatched to the restaurant kitchen. Estimated delivery in <strong className="text-emerald-400">22 mins</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* Cart Item List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-gray-400 py-16">
                  <div className="w-16 h-16 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-500 border border-white/5">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-gray-300">Your Basket is Empty</h3>
                  <p className="text-xs max-w-xs leading-relaxed text-gray-400">
                    Browse food options and click "+ Cart" or "ADD" to populate your meal basket.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#1C2128] border border-white/10 flex items-center justify-between gap-3 group hover:border-rose-500/30 transition-all"
                  >
                    {/* Item Thumbnail & Info */}
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                          {item.name}
                        </h4>
                        <span className="text-xs text-gray-400 font-mono">₹{item.price} each</span>
                      </div>
                    </div>

                    {/* Quantity Controls & Total */}
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center space-x-1.5 bg-gray-900 rounded-lg p-1 border border-white/10">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-bold text-white w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <span className="text-xs font-mono font-black text-emerald-400">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Summary Footer */}
            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="space-y-1.5 text-xs font-mono text-gray-300">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <strong className="text-white">₹{subtotal.toFixed(0)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <strong className={deliveryFee === 0 ? "text-emerald-400" : "text-gray-300"}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </strong>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10 text-white">
                    <span>Total Amount:</span>
                    <span className="text-emerald-400 font-black text-base">₹{grandTotal.toFixed(0)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={onClearCart}
                    className="py-3 bg-gray-800 hover:bg-rose-950/60 hover:text-rose-400 text-gray-300 font-bold rounded-xl text-xs transition-all border border-white/10 flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    className="col-span-2 py-3 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 active:scale-95"
                  >
                    <span>Place Intent Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
