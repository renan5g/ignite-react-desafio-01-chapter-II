import { toast } from 'react-toastify';
import { api } from '../services/api';
import { IProduct, IStock, IUpdateProductDto } from '../types';

async function getProductById(productId: number) {
  const { data } = await api.get<IProduct[]>(`products/${productId}`);
  return data;
}

function findProductById(products: IProduct[], productId: number) {
  return products.find((product) => product.id === productId);
}

function removeProduct(products: IProduct[], productId: number) {
  return products.filter((product) => product.id !== productId);
}

function updateProduct({
  productId,
  products,
  updateProduct,
}: IUpdateProductDto) {
  return products.map((product) =>
    product.id === productId ? { ...product, ...updateProduct } : product
  );
}

async function verifyProductInStock(productId: number, amount: number) {
  const { data: productInStock } = await api.get<IStock>(`stock/${productId}`);

  if (productInStock.amount < amount) {
    toast.error('Quantidade solicitada fora de estoque');
    return true;
  }

  return false;
}

export const ProductsAPI = {
  getProductById,
  findProductById,
  updateProduct,
  removeProduct,
  verifyProductInStock,
};
