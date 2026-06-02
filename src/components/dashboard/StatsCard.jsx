const StatsCard = ({ title, value, icon, colorClass, subtitle }) => {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorClass} text-white shadow-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
