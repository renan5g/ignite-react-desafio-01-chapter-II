import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { ProductsAPI } from '../lib/products';
import { StorageAPI } from '../lib/storage';

import { IProduct } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: IProduct[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

const CART_KEY = '@RocketShoes:cart';

function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<IProduct[]>(() =>
    StorageAPI.getItem(CART_KEY, [] as IProduct[])
  );

  const addProduct = async (productId: number) => {
    try {
      const productInCart = ProductsAPI.findProductById(cart, productId);

      if (!productInCart) {
        const data = await ProductsAPI.getProductById(productId);
        const newCart = [...cart, { ...data, amount: 1 }] as IProduct[];

        StorageAPI.setItem(CART_KEY, newCart);
        setCart(newCart);

        return;
      }

      updateProductAmount({
        productId,
        amount: productInCart.amount + 1,
      });
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productInCart = ProductsAPI.findProductById(cart, productId);

      if (!productInCart) {
        toast.error('Erro na remoção do produto');
        return;
      }

      const cartFiltered = ProductsAPI.removeProduct(cart, productId);

      StorageAPI.setItem(CART_KEY, cartFiltered);
      setCart(cartFiltered);
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const productInCart = ProductsAPI.findProductById(cart, productId);

      if (!productInCart || amount < 1) {
        toast.error('Erro na alteração de quantidade do produto');
        return;
      }

      if (await ProductsAPI.verifyProductInStock(productId, amount)) return;

      const updatedProduct = ProductsAPI.updateProduct({
        productId,
        products: cart,
        updateProduct: { amount },
      });

      StorageAPI.setItem(CART_KEY, updatedProduct);
      setCart(updatedProduct);
    } catch {
      toast.error('Erro ao atualizar pedido do carrinho');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

const useCart = (): CartContextData => useContext(CartContext);

export { CartProvider, useCart };
