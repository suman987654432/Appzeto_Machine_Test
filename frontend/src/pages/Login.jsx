import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

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
            // Role-based redirection after login
            const role = user?.role;
            let redirectPath = '/';
            
            if (role === 'vendor') {
                redirectPath = '/dashboard/vendor';
            } else if (role === 'admin') {
                redirectPath = '/dashboard/admin';
            } else if (role === 'buyer') {
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
            email,
            password,
        };

        dispatch(login(userData));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={onChange}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Login;
