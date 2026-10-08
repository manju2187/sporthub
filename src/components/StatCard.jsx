function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h3>

          <p className="text-xs text-slate-500 mt-2">
            {description}
          </p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default StatCard;