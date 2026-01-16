export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-purple-500/10 to-orange-500/10 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        {children}
      </div>
    </div>
  );
}
