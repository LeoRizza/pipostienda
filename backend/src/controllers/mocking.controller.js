import { fakeProduct } from "../utils/fakeproduct.js";

export const getMockingProducts = (req, res) => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push(fakeProduct());
    }

    res.send({ products });
};


