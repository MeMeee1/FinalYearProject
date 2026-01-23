'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/lib/types';

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, delta: number) => void;
    clearCart: () => void;
    subtotal: number;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save cart to localStorage on changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addToCart = (product: Product, quantity: number) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setItems(prev => prev.map(i => i.id === id
            ? { ...i, quantity: Math.max(1, i.quantity + delta) }
            : i
        ));
    };

    const clearCart = () => {
        setItems([]);
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const delivery = items.length > 0 ? 2000 : 0;
    const total = subtotal + delivery;
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            subtotal,
            total,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
