"use client";

import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password_hash, setPassword_hash] = useState("");
    const [msg, setMsg] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (msg === "Usuário criado. Código enviado ao email.") {
          const timer = setTimeout(() => {
            router.push("/verify");
          }, 2000); // 2 segundos para o usuário ver a mensagem
    
          return () => clearTimeout(timer);
        }
      }, [msg]);


async function handleVerify(e: any) {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, password_hash, name }),
    });

    const data = await res.json();
    setMsg(data.error || data.message);
  }

return (
<div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
<h1 className="text-2xl font-bold text-center">Criar Conta</h1>


<form onSubmit={handleVerify} className="space-y-4">
<div>
<label className="block mb-1 text-sm font-medium">Nome</label>
<input className="w-full p-3 border rounded-xl" required value={name}
          onChange={(e) => setName(e.target.value)}/>
</div>


<div>
<label className="block mb-1 text-sm font-medium">Email</label>
<input type="email" className="w-full p-3 border rounded-xl" required value={email}
          onChange={(e) => setEmail(e.target.value)}/>
</div>


<div>
<label className="block mb-1 text-sm font-medium">Telefone</label>
<input type="tel" className="w-full p-3 border rounded-xl" required value={phone}
          onChange={(e) => setPhone(e.target.value)}/>
</div>


<div>
<label className="block mb-1 text-sm font-medium">Senha</label>
<input type="password" className="w-full p-3 border rounded-xl" required value={password_hash}
          onChange={(e) => setPassword_hash(e.target.value)}/>
</div>


<button type="submit" className="w-full p-3 bg-green-600 text-white rounded-xl">
Criar Conta
</button>
</form>
 {msg && <p className="mt-4">{msg}</p>}

<p className="text-center text-sm">
Já tem conta? <Link href="/login" className="text-blue-600">Entrar</Link>
</p>
</div>
</div>
);
}