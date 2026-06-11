export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl place-items-center px-4 py-10">{children}</div>
    </main>
  );
}
