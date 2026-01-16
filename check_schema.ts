
import { createProductSchema } from './api/src/db/productsSchema';
import { z } from 'zod';

console.log('Checking createProductSchema shape...');
const shape = createProductSchema.shape;
for (const key in shape) {
    if (Object.prototype.hasOwnProperty.call(shape, key)) {
        const field = shape[key];
        // Check if optional
        // Zod fields might be wrapped, so simple check might fail, but let's try basic introspection
        console.log(`Field: ${key}`);
    }
}

const testData = {
    name: "Chicken",
    description: "Chicks",
    price: 90000,
    stock: 50,
    sku: "",
    image: "[]"
};

try {
    createProductSchema.parse(testData);
    console.log("Validation successful for test data");
} catch (e) {
    if (e instanceof z.ZodError) {
        console.log("Validation failed:");
        console.log(JSON.stringify(e.errors, null, 2));
    } else {
        console.log("Validation error:", e);
    }
}
