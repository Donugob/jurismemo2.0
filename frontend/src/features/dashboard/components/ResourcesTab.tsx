"use client";

import { useState } from 'react';
import { FileText, ChevronRight } from 'lucide-react';

export default function ResourcesTab({ initialResources }: { initialResources: any[] }) {
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceLevelFilter, setResourceLevelFilter] = useState('All');

  const filteredResources = initialResources.filter(r => {
    const levelMatch = resourceLevelFilter === 'All' || r.level === resourceLevelFilter;
    const searchMatch = r.title.toLowerCase().includes(resourceSearch.toLowerCase()) || 
                        (r.description && r.description.toLowerCase().includes(resourceSearch.toLowerCase()));
    return levelMatch && searchMatch;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-4xl font-serif tracking-tighter uppercase text-primary border-b border-primary/20 pb-4">Academic Resources</h2>
        <div className="flex flex-1 max-w-md gap-2 mt-4 sm:mt-0">
            <input 
            type="text" 
            placeholder="Search resources..." 
            className="input-field flex-1 text-sm py-2"
            value={resourceSearch}
            onChange={e => setResourceSearch(e.target.value)}
            />
            <select 
            className="p-2 border border-gray-200 rounded-none text-sm bg-white outline-none"
            value={resourceLevelFilter}
            onChange={e => setResourceLevelFilter(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option>100L</option><option>200L</option><option>300L</option><option>400L</option><option>500L</option>
            </select>
        </div>
      </div>
      
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredResources.map(r => (
            <div key={r.id} className="bg-white p-6 border text-primary border-primary hover:bg-primary hover:text-light transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-primary/10" />
              <div className="relative flex items-start justify-between">
                <div className="pr-8">
                  <span className="text-[10px] uppercase tracking-widest font-black text-primary/40 mb-2 block">
                    {r.resource_type} • {r.level}
                  </span>
                  <h3 className="font-bold text-primary mb-1 group-hover:text-primary transition-colors">{r.title}</h3>
                  <p className="text-xs text-primary/60 line-clamp-2 mb-4 leading-relaxed">{r.description || 'Access legal documents, past questions, and lecture notes for your level.'}</p>
                </div>
                <div className="bg-light p-2.5 rounded-none group-hover:bg-primary/10 transition-colors">
                  <FileText className="text-primary/40 group-hover:text-primary" size={20} />
                </div>
              </div>
              <a 
                href={r.file_path.startsWith('http') ? r.file_path : `http://localhost:4000/${r.file_path}`} 
                target="_blank" 
                className="inline-flex items-center gap-2 text-primary text-xs font-bold hover:gap-3 transition-all"
              >
                Download Material <ChevronRight size={14} />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-light rounded-none p-20 border border-dashed border-gray-200 text-center">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-primary/60 font-medium tracking-wide">No materials match your search.</p>
          <button onClick={() => {setResourceSearch(''); setResourceLevelFilter('All')}} className="mt-4 text-primary text-sm font-bold hover:underline">Clear all filters</button>
        </div>
      )}
    </div>
  );
}
