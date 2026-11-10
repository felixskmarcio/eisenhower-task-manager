// Unlike the introductory animation, this stays visible until Suspense resolves.
export default function RouteLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen flex items-center justify-center bg-[#09090b] text-[#ccff00] font-mono"
    >
      Carregando página…
    </div>
  );
}
