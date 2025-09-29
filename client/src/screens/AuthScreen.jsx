import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { loading, error, clearError } = useAuth();
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  useEffect(() => {
    clearError();
  }, [isLogin, clearError]);

  const handleTestLoginClick = () => {
    setTestEmail('test@gmail.com');
    setTestPassword('test@123');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={toggleForm} className="font-medium text-indigo-500 hover:text-indigo-400 focus:outline-none">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {isLogin ? (
          <LoginForm
            testEmail={testEmail}
            testPassword={testPassword}
            clearTestCredentials={() => { setTestEmail(''); setTestPassword(''); }}
          />
        ) : <RegisterForm />}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleTestLoginClick}
            className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
          >
            Continue with Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
