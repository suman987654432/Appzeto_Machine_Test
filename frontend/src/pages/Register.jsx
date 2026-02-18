import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'buyer',
        shopName: '',
        description: '',
    });

    const { name, email, password, role, shopName, description } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            alert(message);
        }

        if (isSuccess || user) {
            // Role-based redirection after registration
            const userRole = user?.role;
            let redirectPath = '/';
            
            if (userRole === 'vendor') {
                redirectPath = '/dashboard/vendor';
            } else if (userRole === 'admin') {
                redirectPath = '/dashboard/admin';
            } else if (userRole === 'buyer') {
                redirectPath = '/dashboard/buyer';
            }

            navigate(redirectPath);
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            password,
            role,
            shopName,
            description
        };

        dispatch(register(userData));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Name" name="name" value={name} onChange={onChange} />
                </div>
                <div className="mb-4">
                    <input type="email" className="w-full px-3 py-2 border rounded" placeholder="Email" name="email" value={email} onChange={onChange} />
                </div>
                <div className="mb-4">
                    <input type="password" className="w-full px-3 py-2 border rounded" placeholder="Password" name="password" value={password} onChange={onChange} />
                </div>
                <div className="mb-4">
                    <select className="w-full px-3 py-2 border rounded" name="role" value={role} onChange={onChange}>
                        <option value="buyer">Buyer</option>
                        <option value="vendor">Vendor</option>
                    </select>
                </div>
                {role === 'vendor' && (
                    <>
                        <div className="mb-4">
                            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Shop Name" name="shopName" value={shopName} onChange={onChange} />
                        </div>
                        <div className="mb-4">
                            <textarea className="w-full px-3 py-2 border rounded" placeholder="Shop Description" name="description" value={description} onChange={onChange} />
                        </div>
                    </>
                )}
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
