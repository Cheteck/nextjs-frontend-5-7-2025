import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  category,
  price,
  image,
}) => {
  return (
    <Link href={`/product/${id}`}>
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center">
        <Image
          src={image}
          alt={name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-lg mr-4 object-cover shadow-md border border-gray-700"
        />
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-gray-400 text-sm">{category}</p>
          <p className="text-green-400">${price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
