import SiteCard from './SiteCard';
import { FolderOpen } from 'lucide-react';

const SiteList = ({ sites, onSiteClick }) => {
  if (!sites || sites.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
          <FolderOpen size={40} className="text-primary opacity-80" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Sites Found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          We couldn't find any sites matching your current filters. Clear filters or add a new site to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sites.map((site) => (
        <SiteCard key={site._id} site={site} onClick={() => onSiteClick && onSiteClick(site)} />
      ))}
    </div>
  );
};

export default SiteList;
