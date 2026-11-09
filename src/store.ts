import { useEffect, useState } from "react";

/**
 * DEMO ordering store: basket, account and orders live in this browser's localStorage only.
 * Swap these actions for real API calls (auth, orders, payments) when the backend is connected.
 */

/** Avellino sells every flavour as a 5 litre tub (≈45 scoops). Price is a placeholder for the demo. */
export const TUB = { litres: 5, scoops: 45, price: 45 };
/**
 * Demo fulfilment rules.
 * Collection from Leeds HQ: no minimum order, free.
 * Online local delivery: Leeds (LS) postcodes, minimum 10 tubs (delivery is free once the minimum is met).
 */
export const DELIVERY = { minTubs: 10, fee: 0, freeFromTubs: 10, postcodePrefixes: ["LS"] };

export const gbp = (amount: number) => `£${amount.toFixed(2)}`;

export type CartLine = { slug: string; qty: number };
export type AccountType = "personal" | "business";
export type Customer = { name: string; email: string; phone: string; type: AccountType; company?: string };
export type FulfilmentMethod = "collection" | "delivery";
export type DeliveryAddress = { line1: string; line2?: string; city: string; postcode: string };
export type PaymentMethod = "card" | "apple" | "google" | "paypal" | "bank" | "invoice" | "collection";
/** Demo payment record — only a label and, for cards, the last 4 digits are kept. */
export type Payment = { method: PaymentMethod; label: string; detail?: string; status: "Paid" | "Invoice due" | "Pay on collection" };
export type Order = {
  id: string;
  createdAt: string;
  email: string;
  lines: CartLine[];
  method: FulfilmentMethod;
  date: string;
  slot: string;
  address?: DeliveryAddress;
  contact: { name: string; email: string; phone: string; company?: string };
  notes?: string;
  payment?: Payment;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "Received" | "Preparing" | "Ready" | "Completed";
};

type State = { cart: CartLine[]; user: Customer | null; customers: Customer[]; orders: Order[]; cartOpen: boolean };

const KEY = "avellino-demo-store-v1";
const empty: State = { cart: [], user: null, customers: [], orders: [], cartOpen: false };

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw), cartOpen: false };
  } catch {
    return empty;
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function update(patch: Partial<State>) {
  state = { ...state, ...patch };
  try {
    const { cartOpen: _ignored, ...persisted } = state;
    localStorage.setItem(KEY, JSON.stringify(persisted));
  } catch {
    /* storage unavailable (private mode) — the demo still works for this page view */
  }
  listeners.forEach((listener) => listener());
}

/** Subscribe a component to the demo store. */
export function useStore() {
  const [, rerender] = useState(0);
  useEffect(() => {
    const listener = () => rerender((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return state;
}

export const tubCount = (lines: CartLine[]) => lines.reduce((sum, line) => sum + line.qty, 0);

export function orderTotals(lines: CartLine[], method: FulfilmentMethod) {
  const tubs = tubCount(lines);
  const subtotal = tubs * TUB.price;
  const deliveryFee = method === "delivery" && tubs > 0 && tubs < DELIVERY.freeFromTubs ? DELIVERY.fee : 0;
  return { tubs, subtotal, deliveryFee, total: subtotal + deliveryFee };
}

export const actions = {
  addTub(slug: string, qty = 1) {
    const existing = state.cart.find((line) => line.slug === slug);
    const cart = existing
      ? state.cart.map((line) => (line.slug === slug ? { ...line, qty: Math.min(99, line.qty + qty) } : line))
      : [...state.cart, { slug, qty }];
    update({ cart, cartOpen: true });
  },
  setQty(slug: string, qty: number) {
    update({ cart: qty <= 0 ? state.cart.filter((l) => l.slug !== slug) : state.cart.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, qty) } : l)) });
  },
  remove(slug: string) {
    update({ cart: state.cart.filter((l) => l.slug !== slug) });
  },
  openCart(open: boolean) {
    update({ cartOpen: open });
  },
  signUp(customer: Customer): string | null {
    const email = customer.email.trim().toLowerCase();
    if (state.customers.some((c) => c.email === email)) return "An account with this email already exists — please log in.";
    const saved = { ...customer, email };
    update({ customers: [...state.customers, saved], user: saved });
    return null;
  },
  /** Demo login: any password is accepted for an email that has signed up in this browser. */
  logIn(email: string): string | null {
    const found = state.customers.find((c) => c.email === email.trim().toLowerCase());
    if (!found) return "No account found with that email. Create an account first.";
    update({ user: found });
    return null;
  },
  logOut() {
    update({ user: null });
  },
  placeOrder(details: Omit<Order, "id" | "createdAt" | "email" | "lines" | "subtotal" | "deliveryFee" | "total" | "status">): Order {
    const totals = orderTotals(state.cart, details.method);
    const order: Order = {
      ...details,
      id: `AVG-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      email: state.user?.email ?? details.contact.email,
      lines: state.cart,
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      status: "Received",
    };
    update({ orders: [order, ...state.orders], cart: [] });
    return order;
  },
  reorder(order: Order) {
    order.lines.forEach((line) => actions.addTub(line.slug, line.qty));
  },
};
