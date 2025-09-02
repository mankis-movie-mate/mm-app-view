export default function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-4 text-center ring-1 ring-white/10">
      <div className="text-2xl font-bold">{k}</div>
      <div className="mt-1 text-xs text-white/70">{v}</div>
    </div>
  );
}
