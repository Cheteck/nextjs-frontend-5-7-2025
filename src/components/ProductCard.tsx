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
      <div className="group bg-gray-900/30 hover:bg-gray-900/50 border border-gray-800/50 hover:border-gray-700/50 rounded-2xl p-4 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-black/20">
        <div className="flex items-center space-x-4">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={name}
              width={80}
              height={80}
              className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg group-hover:text-blue-400 transition-colors duration-200 truncate">
              {name}
            </h3>
            <p className="text-gray-500 text-sm mb-2 truncate">{category}</p>
            <div className="flex items-center justify-between">
              <p className="text-green-400 font-bold text-xl">${price}</p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;