export interface IProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

export interface IStock {
  id: number;
  amount: number;
}

export interface IUpdateProductDto {
  productId: number;
  products: IProduct[];
  updateProduct: Partial<IProduct>;
}
