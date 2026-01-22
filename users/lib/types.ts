
export interface Product {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    price: number;
    stock: number;
    sku: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    sellerId: number;
    video: string | null;
    productTags?: string;
    vendor?: {
        id: number;
        storeName: string;
        storeDescription: string | null;
        businessAddress: string | null;
    };
}

export interface CartItem extends Product {
    quantity: number;
}

export interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    lga?: string;
    token?: string;
}

export interface Order {
    id: number;
    status: string;
    total: number;
    createdAt: string;
    items: CartItem[];
    pickupLocation?: string;
}
