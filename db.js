const products = [
  {
    id: 1,
    name: "Product 1",
    price: 10,
  },
  {
    id: 2,
    name: "Product 2",
    price: 20,
  },
  {
    id: 3,
    name: "Product 3",
    price: 30,
  },
  {
    id: 4,
    name: "Product 4",
    price: 40,
  },
];

export const getProducts = async () => {
  const prodPromise = new Promise((res, rej) => {
    setTimeout(() => {
      res(products);
    }, 1000);
  });

  return prodPromise;
};
