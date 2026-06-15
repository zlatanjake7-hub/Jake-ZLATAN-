import React, { useState } from 'react';
import { AZAM_SHOP, AZAM_MATCHES } from '../data';
import { ShopItem, Match, MatchTicket, ShopOrder, OrderItem } from '../types';
import { ShoppingCart, ShieldCheck, CreditCard, Sparkles, AlertCircle, Trash2, Calendar, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShopProps {
  isOffline: boolean;
  onAddTicket: (ticket: MatchTicket) => void;
  onAddOrder: (order: ShopOrder) => void;
  onSubscribed: () => void;
}

export default function Shop({ isOffline, onAddTicket, onAddOrder, onSubscribed }: ShopProps) {
  // Catalog items
  const [jerseyName, setJerseyName] = useState<string>('FEI TOTO');
  const [jerseyNo, setJerseyNo] = useState<number>(10);
  const [jerseyColor, setJerseyColor] = useState<'blue' | 'white'>('blue');

  // Shopping cart items
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [checkoutModal, setCheckoutModal] = useState<boolean>(false);
  const [chkEmail, setChkEmail] = useState<string>('');
  const [chkPaymentMethod, setChkPaymentMethod] = useState<string>('M-Pesa');
  const [chkLoading, setChkLoading] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<any | null>(null);

  // Ticket booking forms state
  const upcomingMatches = AZAM_MATCHES.filter((m) => m.status === 'upcoming');
  const [ticketMatchId, setTicketMatchId] = useState<string>(upcomingMatches[0]?.id || '');
  const [ticketClass, setTicketClass] = useState<'VIP' | 'Regular' | 'Diehard'>('Regular');
  const [seatPref, setSeatPref] = useState<string>('Block B Row 4');

  const getTicketPrice = (cl: string) => {
    if (cl === 'VIP') return 25000;
    if (cl === 'Diehard') return 12000;
    return 7000;
  };

  const handleCustomJerseyAddToCart = () => {
    const itemIdx = jerseyColor === 'blue' ? 'sh-1' : 'sh-2';
    const originalItem = AZAM_SHOP.find((i) => i.id === itemIdx)!;

    const customizedItem: OrderItem = {
      id: `custom-jersey-${Date.now()}`,
      itemId: originalItem.id,
      itemName: `${originalItem.name} (${jerseyName.toUpperCase()} #${jerseyNo})`,
      itemImage: originalItem.image,
      price: originalItem.price,
      quantity: 1,
      size: 'L'
    };

    setCart((prev) => [...prev, customizedItem]);
  };

  const handleAddToCart = (item: ShopItem) => {
    // Check if membership is added
    const existing = cart.find((i) => i.itemId === item.id);
    if (existing) {
      setCart((prev) =>
        prev.map((i) => (i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      );
    } else {
      const order: OrderItem = {
        id: `order-item-${Date.now()}`,
        itemId: item.id,
        itemName: item.name,
        itemImage: item.image,
        price: item.price,
        quantity: 1,
        size: item.sizes ? item.sizes[0] : undefined
      };
      setCart((prev) => [...prev, order]);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const getTotalCartAmount = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Submit complete transaction
  const handleProceedCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setChkLoading(true);

    const total = getTotalCartAmount();

    try {
      // Simulate API callback integration with backend
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          paymentMethod: chkPaymentMethod,
          email: chkEmail || 'supporter@azamfc.co.tz',
          type: 'Merchandise'
        })
      });

      const data = await response.json();
      if (response.ok && data.status === 'Success') {
        const completedOrder: ShopOrder = {
          id: data.orderId,
          items: [...cart],
          totalAmount: total,
          paymentMethod: chkPaymentMethod,
          purchasedAt: data.date,
          status: 'Paid'
        };

        // If a subscriber subscription exists in cart, trigger parent subscription change
        const hasSubscription = cart.some((i) => i.itemId === 'sh-4');
        if (hasSubscription) {
          onSubscribed();
        }

        onAddOrder(completedOrder);
        setReceipt(data);
        setCart([]); // Clear cart
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChkLoading(false);
    }
  };

  // Handle immediate Ticket Purchasing checkout
  const handleBookTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) {
      alert("malipo: You cannot book tickets while offline. Connection needed for SMS gateway confirmation.");
      return;
    }

    const tMatch = AZAM_MATCHES.find((m) => m.id === ticketMatchId)!;
    const price = getTicketPrice(ticketClass);

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price,
          paymentMethod: 'Mobile Money Gateway',
          type: 'Ticket'
        })
      });

      const data = await response.json();
      if (response.ok && data.status === 'Success') {
        const completedTicket: MatchTicket = {
          id: `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
          matchId: ticketMatchId,
          matchTitle: `${tMatch.homeTeam} vs ${tMatch.awayTeam}`,
          venue: tMatch.venue,
          date: tMatch.date,
          time: tMatch.time,
          ticketClass: ticketClass,
          price: price,
          seatNumber: seatPref,
          purchasedAt: data.date,
          qrValue: `AZAMFC-TKT-${data.transactionId}`
        };

        onAddTicket(completedTicket);
        alert(`Hongera! Ticket booked successfully in ${ticketClass} class! View QR ticket inside 'My Club' profile page.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10" id="shop-tab">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-sans font-black tracking-tight text-white">Jersey customizer & club ticket bookings</h2>
        <p className="text-xs text-slate-400">Draft customized jerseys, attend NBC premier fixtures, and buy original supporters merchandise.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Customizer + Tickets + Shop items */}
        <div className="lg:col-span-2 space-y-10">
          {/* Interactive Jersey Designer */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-850 shadow-2xl space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] bg-yellow-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                3D CUSTOM DESIGNER
              </span>
              <h3 className="text-lg font-bold font-sans">Official Azam FC Jersey Customizer</h3>
              <p className="text-xs text-slate-400">Custom print your own name and squad number on high quality NBC Premier sportswear.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Virtual Mock Shirt Canvas Rendering */}
              <div className="flex justify-center bg-slate-950 p-4 rounded-xl border border-slate-900" id="canvas-preview-box">
                <div
                  className={`w-48 h-64 rounded-t-3xl rounded-b-xl relative flex flex-col items-center justify-center border-t-8 border-b-2 shadow-2xl transition-all ${
                    jerseyColor === 'blue'
                      ? 'bg-blue-600 border-blue-800'
                      : 'bg-white text-blue-950 border-gray-300'
                  }`}
                >
                  {/* Sleeve cutoffs */}
                  <div className={`absolute -left-4 top-0 w-4 h-16 rounded-l-lg ${jerseyColor === 'blue' ? 'bg-blue-750' : 'bg-gray-100'}`} />
                  <div className={`absolute -right-4 top-0 w-4 h-16 rounded-r-lg ${jerseyColor === 'blue' ? 'bg-blue-750' : 'bg-gray-100'}`} />

                  {/* Collar details */}
                  <div className="absolute top-0 w-16 h-6 bg-yellow-400 rounded-b-full shadow" />

                  {/* Logo crest */}
                  <div className="absolute top-10 left-4 bg-white text-blue-900 font-bold p-0.5 rounded-lg text-[8px] flex items-center justify-center scale-75">
                    AzamFC
                  </div>

                  {/* Name and Number Printing */}
                  <div className="text-center space-y-1 z-10 font-mono mt-4">
                    <span className={`block text-[11px] font-black tracking-widest ${jerseyColor === 'blue' ? 'text-white' : 'text-blue-950'}`}>
                      {jerseyName.toUpperCase() || 'WANALAMBANI'}
                    </span>
                    <span className={`block text-6xl font-black ${jerseyColor === 'blue' ? 'text-yellow-400' : 'text-blue-900'}`}>
                      {jerseyNo}
                    </span>
                  </div>

                  <span className={`absolute bottom-3 text-[9px] font-semibold tracking-widest uppercase opacity-75 ${jerseyColor === 'blue' ? 'text-blue-200' : 'text-blue-800'}`}>
                    Spons: Bakhresa
                  </span>
                </div>
              </div>

              {/* Cust Settings */}
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold uppercase tracking-wider block">Shirt Print Name</label>
                  <input
                    type="text"
                    maxLength={14}
                    value={jerseyName}
                    onChange={(e) => setJerseyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold uppercase tracking-wider block">Shirt Squad Number</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={jerseyNo}
                    onChange={(e) => setJerseyNo(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-300 font-bold uppercase tracking-wider block">Primary Color Select</span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setJerseyColor('blue')}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                        jerseyColor === 'blue' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Royal Blue (Home)
                    </button>
                    <button
                      onClick={() => setJerseyColor('white')}
                      className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                        jerseyColor === 'white' ? 'bg-slate-800 border-slate-605 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Pristine White (Away)
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCustomJerseyAddToCart}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-2.5 rounded-xl transition-colors shadow-lg cursor-pointer"
                  >
                    Custom Finish & Add to Cart (35,000 TZS)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Booking Interface */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-sans flex items-center space-x-1.5">
                <Calendar size={18} className="text-blue-500" />
                <span>E-Ticket stadium seat reservation</span>
              </h3>
              <p className="text-xs text-slate-400">Book entry barcodes for upcoming NBC Premier League home matches at Chamazi.</p>
            </div>

            {upcomingMatches.length > 0 ? (
              <form onSubmit={handleBookTicket} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-3.5 text-xs">
                  {/* Match select */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold block">Select Match</label>
                    <select
                      value={ticketMatchId}
                      onChange={(e) => setTicketMatchId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-lg outline-none focus:border-blue-500"
                    >
                      {upcomingMatches.map((m) => (
                        <option key={m.id} value={m.id} className="bg-slate-900 text-slate-100">
                          {m.homeTeam} vs {m.awayTeam} ({m.date})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Seat category select */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold block">Ticket Class Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Regular', 'Diehard', 'VIP'] as const).map((cl) => (
                        <button
                          type="button"
                          key={cl}
                          onClick={() => setTicketClass(cl)}
                          className={`py-2 rounded-lg border text-center font-bold transition-colors cursor-pointer text-xs ${
                            ticketClass === cl
                              ? 'bg-blue-600 border-blue-550 text-white shadow-sm'
                              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          {cl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seat location preference */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold block">Seat Block Preference</label>
                    <input
                      type="text"
                      value={seatPref}
                      onChange={(e) => setSeatPref(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-lg outline-none text-xs focus:border-blue-500"
                      placeholder="e.g. Block A Row 12"
                    />
                  </div>
                </div>

                <div className="space-y-4" id="ticket-booking-checkout">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px]">TICKET PRICE</span>
                      <span className="font-mono text-lg font-black text-blue-400">{getTicketPrice(ticketClass).toLocaleString()} TZS</span>
                    </div>
                    <div className="text-right text-[10px] text-slate-400">
                      <span>Gate Access + Seats Incl.</span>
                      <span className="block italic text-blue-400 text-[9px]">Secure payment gateway</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-650 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                    id="book-ticket-action-btn"
                  >
                    Confirm & Reserve E-Ticket
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <span>No upcoming match ticket schedules reported. Try again later.</span>
              </div>
            )}
          </div>

          {/* Standard Apparel Store Catalog */}
          <div className="space-y-4">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Original Accessories & Membership Packages</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="standard-shop-grid">
              {AZAM_SHOP.filter(item => item.id !== 'sh-1' && item.id !== 'sh-2').map((item) => (
                <div
                  key={item.id}
                  id={`shop-item-${item.id}`}
                  className="bg-slate-900 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col justify-between"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[9px] text-blue-400 font-semibold bg-blue-950/20 border border-blue-900/35 px-2 py-0.5 rounded-full inline-block uppercase">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-white font-sans leading-snug">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-850 pt-3 text-xs">
                      <span className="font-mono font-black text-blue-400">{item.price.toLocaleString()} TZS</span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Standard shopping cart summary & Checkout */}
        <div className="space-y-6" id="cart-and-checkout-panel">
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-sans flex items-center space-x-1.5 border-b border-slate-800 pb-2">
              <ShoppingCart size={18} className="text-blue-500" />
              <span>Checkout Basket</span>
              {cart.length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.5 ml-auto">
                  {cart.length}
                </span>
              )}
            </h3>

            {cart.length > 0 ? (
              <div className="space-y-4" id="cart-item-lists">
                <div className="space-y-3 pr-1 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex space-x-2 text-xs border-b border-slate-850 pb-2">
                      <img src={item.itemImage} alt={item.itemName} className="w-8 h-8 rounded object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1 space-y-0.5 min-w-0">
                        <span className="font-semibold text-slate-200 truncate block text-[11px]">{item.itemName}</span>
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span>Qty: {item.quantity}</span>
                          <span className="font-mono font-bold text-blue-400">{(item.price * item.quantity).toLocaleString()} TZS</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-slate-500 hover:text-rose-550 self-center"
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Sub Total */}
                <div className="border-t border-slate-800 pt-3 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Total Merchandise:</span>
                    <span className="font-mono font-black text-white text-sm">{getTotalCartAmount().toLocaleString()} TZS</span>
                  </div>

                  <button
                    onClick={() => setCheckoutModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Proceed to Payments</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500" id="empty-cart-display">
                <ShoppingCart size={24} className="mx-auto mb-1.5 opacity-45 animate-pulse" />
                <p className="text-xs">Your shopping basket is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal Form Overlay */}
      <AnimatePresence>
        {checkoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-800 space-y-5"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-sans flex items-center space-x-1">
                  <CreditCard size={18} className="text-blue-500" />
                  <span>Secure Mobile Money Payment</span>
                </h3>
                <p className="text-[10px] text-slate-400">Provide billing details to authorize payment push prompt.</p>
              </div>

              {!receipt ? (
                <form onSubmit={handleProceedCheckout} className="space-y-4 text-xs">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold block">Receipt Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. supporter@azamfc.co.tz"
                      value={chkEmail}
                      onChange={(e) => setChkEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-lg outline-none text-xs focus:border-blue-500"
                    />
                  </div>

                  {/* Payment channel select */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold block">Mobile Network Operator</label>
                    <select
                      value={chkPaymentMethod}
                      onChange={(e) => setChkPaymentMethod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-lg outline-none text-xs focus:border-blue-500"
                    >
                      <option value="M-Pesa" className="bg-slate-900">Vodacom M-Pesa (TZS)</option>
                      <option value="Tigo Pesa" className="bg-slate-900">Tigo Pesa (TZS)</option>
                      <option value="Airtel Money" className="bg-slate-900">Airtel Money (TZS)</option>
                      <option value="HaloPesa" className="bg-slate-900">Halotel HaloPesa (TZS)</option>
                      <option value="Azam Pay" className="bg-slate-900">Azam Pay Wallet (TZS)</option>
                    </select>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[10px] text-slate-400 space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>Total Invoice:</span>
                      <span>{getTotalCartAmount().toLocaleString()} TZS</span>
                    </div>
                    <p className="italic text-[9px] pt-1 border-t border-slate-850">
                      * You will receive a mobile money USSD prompt on your phone matching this total bill.
                    </p>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutModal(false)}
                      className="flex-1 bg-slate-800 hover:bg-slate-705 text-slate-300 font-bold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={chkLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1"
                    >
                      {chkLoading ? 'Prompting USSD...' : 'Complete Malipo'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 animate-fade-in text-xs" id="receipt-display">
                  <div className="bg-emerald-950/20 text-emerald-405 p-3.5 rounded-xl border border-emerald-900/40 text-center space-y-1">
                    <ShieldCheck size={28} className="mx-auto text-emerald-505 animate-bounce" />
                    <span className="font-bold block tracking-wide text-emerald-400">MALIPO YAMEKAMILIKA</span>
                    <p className="text-[10px] text-emerald-300">Payment of {receipt.amount.toLocaleString()} TZS received successfully!</p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1.5 font-mono text-[10px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Ref Transaction No:</span>
                      <span className="font-bold text-white">{receipt.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Order Confirmation:</span>
                      <span className="font-semibold text-slate-205">{receipt.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Channel Network:</span>
                      <span>{chkPaymentMethod} Channel</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date Settled:</span>
                      <span>{receipt.date.split('T')[0]}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCheckoutModal(false);
                      setReceipt(null);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg cursor-pointer text-center"
                  >
                    Return to Shop
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
