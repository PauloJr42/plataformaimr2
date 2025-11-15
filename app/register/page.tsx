
import Link from "next/link";

export default function RegisterPage() {
return (
<div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
<h1 className="text-2xl font-bold text-center">Criar Conta</h1>


<form className="space-y-4">
<div>
<label className="block mb-1 text-sm font-medium">Nome</label>
<input className="w-full p-3 border rounded-xl" required />
</div>


<div>
<label className="block mb-1 text-sm font-medium">Email</label>
<input type="email" className="w-full p-3 border rounded-xl" required />
</div>


<div>
<label className="block mb-1 text-sm font-medium">Telefone</label>
<input type="tel" className="w-full p-3 border rounded-xl" required />
</div>


<div>
<label className="block mb-1 text-sm font-medium">Senha</label>
<input type="password" className="w-full p-3 border rounded-xl" required />
</div>


<button type="submit" className="w-full p-3 bg-green-600 text-white rounded-xl">
Criar Conta
</button>
</form>


<p className="text-center text-sm">
Já tem conta? <Link href="/login" className="text-blue-600">Entrar</Link>
</p>
</div>
</div>
);
}