
"use client";
import { useState } from "react";
import Todo from "./Todo";
import Signup from "./signup";
import Login from "./login";
import { Button } from "@/components/ui/button";

type User = {
  email: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setUser({ email }); 
  };

  const handleSignup = async (email: string, password: string) => {
    setIsSignedUp(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-200">
      {user ? (
        <>
          <Todo />
          <Button onClick={handleLogout} className="mt-4">Logout</Button>
        </>
      ) : isSignedUp ? (
        <Login onLogin={handleLogin} onSwitch={() => setIsSignedUp(false)} />
      ) : (
        <Signup onSignup={handleSignup} onSwitch={() => setIsSignedUp(true)} />
      )}
    </main>
  );
}