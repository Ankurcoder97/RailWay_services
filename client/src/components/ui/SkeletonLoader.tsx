export default function SkeletonLoader() {
  return (
    <div className="card-panel p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-800 rounded-lg"></div>
          <div className="h-7 w-64 bg-slate-800 rounded-xl"></div>
          <div className="h-3 w-40 bg-slate-800 rounded-md"></div>
        </div>
        <div className="h-10 w-10 bg-slate-800 rounded-2xl"></div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-slate-800 rounded-md"></div>
          <div className="h-3 w-20 bg-slate-800 rounded-md"></div>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-28 bg-slate-950 rounded-xl border border-slate-800"></div>
        <div className="h-28 bg-slate-950 rounded-xl border border-slate-800"></div>
      </div>
    </div>
  );
}
