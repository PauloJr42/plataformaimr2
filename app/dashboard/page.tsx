// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function DashboardPage() {
  const token = (await cookies()).get(process.env.TOKEN_NAME!)?.value;

  if (!token) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Você não está logado.</h1>
      </div>
    );
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Sessão inválida.</h1>
      </div>
    );
  }

  const userId = payload.sub;

  // Buscar compras pagas
  const { data: purchases } = await supabaseAdmin
    .from("purchases")
    .select("product_id, products(title, description)")
    .eq("user_id", userId)
    .eq("status", "paid")
    .order("id", { ascending: false });

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Meus Downloads</h1>

      {(!purchases || purchases.length === 0) && (
        <p>Você ainda não comprou nenhum produto.</p>
      )}

      <ul className="space-y-4">
        {purchases?.map((item) => (
          <li
            key={item.product_id}
            className="border p-4 rounded-lg shadow-sm bg-white"
          >
            <h2 className="font-semibold text-lg">
              {item.products?.[0]?.title ?? ""}
            </h2>

            <p className="text-sm text-gray-600 mb-2">
              {item.products?.[0]?.description ?? ""}
            </p>

            <a
              href={`/api/files/${item.product_id}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Baixar arquivo
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
