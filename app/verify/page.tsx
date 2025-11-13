"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

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
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Verificar Conta</h2>
      <form onSubmit={handleVerify}>

        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <label>Código recebido:</label>
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Verificar
        </button>
      </form>

      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}
