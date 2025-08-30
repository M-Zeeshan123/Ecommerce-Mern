import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import "./login.css";
import { login } from '../../redux/apiCalls';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const history = useHistory();
    
    // Get error and loading state from Redux store
    const { isFetching, error: loginError } = useSelector((state) => state.user);
    const displayError = error || loginError;

    // Check authentication status on component mount and when Redux state changes
    useEffect(() => {
        try {
            const persistRoot = localStorage.getItem("persist:root");
            if (persistRoot) {
                const userData = JSON.parse(JSON.parse(persistRoot).user);
                const currentUser = userData?.currentUser;
                
                if (currentUser?.isAdmin && currentUser?.accessToken) {
                    history.push("/");
                }
            }
        } catch (err) {
            console.error("Error checking authentication:", err);
        }
    }, [history]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            await login(dispatch, { email, password });
            
            // Add a small delay to ensure Redux state is updated
            setTimeout(() => {
                try {
                    const persistRoot = localStorage.getItem("persist:root");
                    if (!persistRoot) {
                        setError("Authentication failed");
                        return;
                    }

                    const userData = JSON.parse(JSON.parse(persistRoot).user);
                    const currentUser = userData?.currentUser;

                    if (!currentUser) {
                        setError("Authentication failed");
                        return;
                    }

                    if (!currentUser.isAdmin) {
                        setError("Access denied. Admin privileges required.");
                        localStorage.removeItem("persist:root");
                        return;
                    }

                    if (currentUser.isAdmin && currentUser.accessToken) {
                        history.push("/");
                    } else {
                        setError("Authentication failed");
                    }
                } catch (error) {
                    console.error("Error checking auth state:", error);
                    setError("Authentication failed");
                }
            }, 100); // Small delay to ensure Redux store is updated
            
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Invalid credentials");
        }
    };

    return (
        <div className="login">
            <div className="loginWrapper">
                <h1 className="adminloginheading">Admin Login</h1>
                {displayError && (
                    <div className="error-message" style={{
                        color: 'red',
                        marginBottom: '10px',
                        textAlign: 'center'
                    }}>
                        {displayError}
                    </div>
                )}
                <form className="loginForm" onSubmit={handleLogin}>
                    <div className="loginItem">
                        <input
                            type="email"
                            placeholder="Email"
                            disabled={isFetching}
                            value={email}
                            className="loginInput"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="loginItem">
                        <input
                            type="password"
                            placeholder="Password"
                            disabled={isFetching}
                            value={password}
                            className="loginInput"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        className="loginButton" 
                        type="submit" 
                        disabled={isFetching}
                        style={{
                            opacity: isFetching ? 0.7 : 1,
                            cursor: isFetching ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isFetching ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
