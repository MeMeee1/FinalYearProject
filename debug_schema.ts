
import { createProductSchema } from './api/src/db/productsSchema';

const testData = {
    name: "newwwwwwwwwwwwwwwwwww",
    description: "neww description",
    price: 90,
    stock: 90,
    sku: "",
    images: ["https://some-url.com/image.png"]
};

try {
    createProductSchema.parse(testData);
    console.log("SCHEMA_VALIDATION_SUCCESS");
} catch (e: any) {
    console.log("SCHEMA_VALIDATION_FAILED");
    if (e.errors) {
        console.log("ERRORS:", JSON.stringify(e.errors));
    } else {
        console.log("ERROR:", e.message);
    }
}
