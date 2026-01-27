
export interface Product {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    price: number;
    stock: number;
    sku: string | null;
    supportsOutsideLgaDelivery?: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    sellerId: number;
    video: string | null;
    productTags?: string;
    speciesBreed?: string;
    age?: string;
    weightSize?: string;
    growthStage?: string;
    healthStatus?: string;
    vaccinationStatus?: string;
    diseaseHistory?: string;
    vendor?: {
        id: number;
        storeName: string;
        storeDescription: string | null;
        businessAddress: string | null;
        assignedVerificationPointId?: number;
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
    totalAmount: number;
    deliveryStatus: 'pending' | 'dropped_off' | 'collected' | 'rejected';
    pickupCode?: string;
    fulfillmentPointId?: number;
    fulfillmentPoint?: {
        name: string;
        address: string;
        city: string;
    };
    createdAt: string;
    items: CartItem[];
}
