"use strict";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SignupProps {
  onSignup: (email: string, password: string) => Promise<void>;
  onSwitch: () => void;
}

export default function Signup({ onSignup, onSwitch }: SignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add this line

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when the form is submitted
    onSignup(email, password);
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);

    if (data) {
      onSignup(email, password);
    } else {
      onSwitch();
    }
    setIsLoading(false); // Set loading to false after the request is completed
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle>
          <CardDescription className=" text-center">
            Enter your email and password to create a new account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="p-4 space-y-2">
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
              {isLoading ? 'Loading...' : 'Sign up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p>
            Already have an account?{" "}
            <span className="text-blue-500 cursor-pointer" onClick={onSwitch}>
              Log in
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}