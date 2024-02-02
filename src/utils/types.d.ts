// Destination types
interface Image {
  imageUrl: string;
  imagePublicId?: string;
}

interface Category {
  content: string;
}

export interface Destination {
  id: number;
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  categoryId: number;
  images: Image[];
  category: Category;
}
