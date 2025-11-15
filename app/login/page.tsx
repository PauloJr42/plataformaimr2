import Link from "next/link";


export default function LoginPage() {
return (
<div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
<h1 className="text-2xl font-bold text-center">Entrar</h1>


<form className="space-y-4">
<div>
<label className="block mb-1 text-sm font-medium">Email</label>
<input type="email" className="w-full p-3 border rounded-xl" required />
</div>


<div>
<label className="block mb-1 text-sm font-medium">Senha</label>
<input type="password" className="w-full p-3 border rounded-xl" required />
</div>


<button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-xl">
Entrar
</button>
</form>


<p className="text-center text-sm">
Não tem conta? <Link href="/register" className="text-blue-600">Cadastrar</Link>
</p>
</div>
</div>
);
}