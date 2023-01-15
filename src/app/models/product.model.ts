export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: Category;
  taxes?: number;
}

// Omit hace que omitan ciertos atributos de la clase que se esta extendiendo
export interface CreateProductDTO extends Omit<Product, 'id' | 'category'>{
  categoryId: number;
}

// Partial hace que todos los atributos sean opcionales
export interface UpdateProductDTO extends Partial<CreateProductDTO>{ }
