import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { ShoppingCart, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);

    // Check if user can access cart (only buyers and non-logged users)
    const isBuyer = user?.role === 'buyer' || !user;

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    return (
        <header className="bg-white shadow p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/login" className="text-2xl font-bold text-blue-600">MarketPlace</Link>

                <nav className="flex items-center space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-blue-500">Home</Link>

                    {user ? (
                        <>
                            {user.role === 'buyer' && (
                                <Link to="/dashboard/buyer" className="text-gray-600 hover:text-blue-500">Dashboard</Link>
                            )}
                            {user.role === 'vendor' && (
                                <Link to="/dashboard/vendor" className="text-gray-600 hover:text-blue-500">Vendor Dashboard</Link>
                            )}
                            {user.role === 'admin' && (
                                <Link to="/dashboard/admin" className="text-gray-600 hover:text-blue-500">Admin Dashboard</Link>
                            )}

                            <button onClick={onLogout} className="flex items-center text-red-500 hover:text-red-700">
                                <LogOut className="w-5 h-5 mr-1" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
                            <Link to="/register" className="text-gray-600 hover:text-blue-500">Register</Link>
                        </>
                    )}

                 
                    {isBuyer && (
                        <Link to="/cart" className="relative text-gray-600 hover:text-blue-500">
                            <ShoppingCart className="w-6 h-6" />
                            {items.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {items.length}
                                </span>
                            )}
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
