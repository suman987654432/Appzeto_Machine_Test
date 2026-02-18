import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart(product));
    };

    return (
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
            <p className="text-sm text-gray-500 mb-4">Stock: {product.stock}</p>
            <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full disabled:bg-gray-400"
                disabled={product.stock <= 0}
            >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    );
};

export default ProductCard;
