"use client";

export default function TestCheckout() {
  const startCheckout = async () => {
    const productId = prompt("Digite o productId do Supabase:");
    if (!productId) return;

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    else alert("Erro! Veja o console.");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Teste de Checkout</h1>
      <button onClick={startCheckout}>Comprar</button>
    </div>
  );
}
