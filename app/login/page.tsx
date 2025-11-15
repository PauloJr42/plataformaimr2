"use client";

import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {

        
        const [email, setEmail] = useState("");
    
        const [password_hash, setPassword_hash] = useState("");
        const [msg, setMsg] = useState("");
        const router = useRouter();
    
        useEffect(() => {
            if (msg === "Login efetuado com sucesso.") {
              const timer = setTimeout(() => {
                router.push("/verify");
              }, 2000); // 2 segundos para o usuário ver a mensagem
        
              return () => clearTimeout(timer);
            }
          }, [msg]);


    async function handleVerify(e: any) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password_hash }),
    });

    const data = await res.json();
    setMsg(data.error || data.message);
  }

return (
<div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
<h1 className="text-2xl font-bold text-center">Entrar</h1>


<form onSubmit={handleVerify} className="space-y-4">
<div>
<label className="block mb-1 text-sm font-medium">Email</label>
<input type="email" className="w-full p-3 border rounded-xl" required value={email}
          onChange={(e) => setEmail(e.target.value)}/>
</div>


<div>
<label className="block mb-1 text-sm font-medium">Senha</label>
<input type="password" className="w-full p-3 border rounded-xl" required value={password_hash}
          onChange={(e) => setPassword_hash(e.target.value)}/>
</div>


<button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-xl">
Entrar
</button>
</form>
    {msg && <p className="mt-4">{msg}</p>}

<p className="text-center text-sm">
Não tem conta? <Link href="/register" className="text-blue-600">Cadastrar</Link>
</p>
</div>
</div>
);
}