
"use strict";
import { useState } from 'react';
import { PrismaClient, Prisma } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const prisma = new PrismaClient();

interface LoginProps {
    onLogin: (email: string, password: string) => Promise<void>;
    onSwitch: () => void;
}

export default function Login({ onLogin, onSwitch }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add this line

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true when the form is submitted
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const user = await response.json();

        if(user.token){
            localStorage.setItem('jwt',user.token);
            onLogin(email, password);
        }else{
            alert('Invalid username or password');
        }
        setIsLoading(false); // Set loading to false after the request is completed
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold text-center'>Log In</CardTitle>
                    <CardDescription className='text-center'>Enter your email and password to log in.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="p-2 space-y-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="w-full px-3 py-2 border text-blue-500 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full px-3 py-2 border text-blue-500 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                        <Button type="submit" className="w-full px-3 py-2" disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Log in'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p> Do not have an account? <span className='text-blue-500 cursor-pointer' onClick={onSwitch}>Signup</span></p>
                </CardFooter>
            </Card>
        </div>
    );
}