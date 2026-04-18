// app/auth/reset-password/[token]/page.js
"use client";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const params = useParams(); // Ye URL se [token] nikal lega
  const token = params.token; 
  const [password, setPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    
    // Yahan aap apni Backend API ko call karenge
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        token: token, 
        password: password 
      }),
    });

    if (res.ok) {
      alert("Password updated!");
    }
  };

  return (
    // Aapka sundar sa orange theme wala form
    <form onSubmit={handleReset}>
       {/* Input fields... */}
    </form>
  );
}