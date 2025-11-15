"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
     const router = useRouter();

   const [email, setEmail] = useState("");
     const [code, setCode] = useState("");
    const [msg, setMsg] = useState("");

  useEffect(() => {
    if (msg === "Conta verificada com sucesso!") {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000); // 2 segundos para o usuário ver a mensagem

      return () => clearTimeout(timer);
    }
  }, [msg]);

    
    

  async function handleVerify(e: any) {
    e.preventDefault();

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    setMsg(data.error || data.message);
  }
    
return (
<div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
<h1 className="text-xl font-bold text-center">Verificação</h1>
<p className="text-sm text-gray-600 text-center">Digite o Email cadastrado e o código que enviamos para seu email.</p>


<form onSubmit={handleVerify} className="space-y-4">
<div>
 <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-xl text-center tracking-widest text-lg" />

 <label>Código recebido:</label>
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)} className="w-full p-3 border rounded-xl text-center tracking-widest text-lg" maxLength={6} />
</div>


<button type="submit" className="w-full p-3 bg-purple-600 text-white rounded-xl">
Verificar
</button>
</form>
 {msg && <p className="mt-4">{msg}</p>}
</div>
</div>
);
}