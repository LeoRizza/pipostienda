import { faker } from '@faker-js/faker';

export const fakeProduct = () => {
    return {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(/* { max: 100000 } */),
        stock: faker.number.int(),
        category: faker.commerce.department(),
        code: faker.string.alphanumeric(15),
        thumbnail: [],
        
    };
};