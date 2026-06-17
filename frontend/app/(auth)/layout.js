export default function AuthLayout({ children }) {
  return (
    <main className="auth-shell text-white">
      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl place-items-center px-4 py-10">
        {children}
      </div>
    </main>
  );
}
