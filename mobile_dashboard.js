const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/app/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Padding on Content Area
content = content.replace(
  'p-6 md:p-10',
  'p-4 sm:p-6 md:p-10'
);

// 2. Hide specific elements
content = content.replace(
  '<aside className="w-full md:w-64 shrink-0">',
  '<aside className="hidden md:block md:w-64 shrink-0">'
);

// 3. Mobile Navigation inject
content = content.replace(
  '{/* Content Area */}',
  `{/* Mobile Navigation */}
        <div className="md:hidden w-full overflow-x-auto mb-6 border-b border-primary/20 sticky top-[72px] bg-light z-40 pb-2 -mx-4 px-4 w-[calc(100%+2rem)] scrollbar-hide">
          <div className="flex gap-2 w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={\`flex items-center gap-2 px-4 py-3 text-[10px] uppercase tracking-widest font-bold border transition-colors \${
                  activeTab === tab.id 
                    ? 'bg-primary text-light border-primary' 
                    : 'bg-white text-primary/60 border-primary/20 shadow-sm'
                }\`}
              >
                {tab.icon && <span className="opacity-70 scale-75">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}`
);

// 4. Update GPA cards
content = content.replace(
  `<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-primary text-light p-8 border border-primary relative overflow-hidden">
                      <p className="opacity-80 font-medium tracking-wide mb-1">
                        {selectedLevel === 'All' ? 'Overall Avg' : \`\${selectedLevel} GPA\`}
                      </p>
                      <h3 className="text-4xl font-bold">{calculateSemesterGpa()}</h3>
                    </div>
                    <div className="bg-secondary text-light p-8 border border-secondary relative overflow-hidden">
                      <p className="opacity-80 font-medium tracking-wide mb-1">General CGPA</p>
                      <h3 className="text-4xl font-bold">{calculateCgpa()}</h3>
                    </div>
                  </div>`,
  `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-6 border-l-4 border-l-primary border-y border-r border-primary/20 relative shadow-sm">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-primary/60 mb-2">
                        {selectedLevel === 'All' ? 'Overall Avg' : \`\${selectedLevel} GPA\`}
                      </p>
                      <h3 className="text-5xl font-serif tracking-tighter text-primary">{calculateSemesterGpa()}</h3>
                    </div>
                    <div className="bg-white p-6 border-l-4 border-l-secondary border-y border-r border-primary/20 relative shadow-sm">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-primary/60 mb-2">General CGPA</p>
                      <h3 className="text-5xl font-serif tracking-tighter text-primary">{calculateCgpa()}</h3>
                    </div>
                  </div>`
);

// 5. Update Grads Table to Desktop-Only and add Mobile layout
const tableStr = `<div className="overflow-x-auto">
                      <table className="w-full text-left">`;

content = content.replace(
  tableStr,
  `{/* Mobile List View */}
                      <div className="md:hidden space-y-4 mb-4">
                        {filteredGrades.map(g => (
                          <div key={g.id} className="bg-white p-4 border border-primary/20 relative shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="font-bold text-primary font-serif tracking-tight text-xl">{g.course_code}</div>
                                <div className="text-[10px] uppercase tracking-widest text-primary/60 font-bold mt-1 line-clamp-1">{g.course?.title}</div>
                              </div>
                              <div className="text-right">
                                <span className="font-serif text-3xl font-bold text-primary leading-none">{g.grade}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-end border-t border-primary/10 pt-3 mt-1">
                              <div className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                                {g.level} • {g.semester.replace(\`\${g.level} \`, '')}
                              </div>
                              <button onClick={() => handleDeleteGrade(g.id)} className="text-red-500/80 font-bold text-[10px] uppercase tracking-widest">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table View */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">`
);

// 6. Fix filter layouts so they don't squish horizontally
content = content.replace(
  `<div className="flex gap-2">`,
  `<div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto mt-4 md:mt-0">`
);

content = content.replace(
  `className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-none hover: transition-all whitespace-nowrap"`,
  `className="col-span-2 md:col-span-1 px-4 py-3 md:py-2 bg-primary text-white text-xs uppercase tracking-widest font-bold border border-primary shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"`
);

// 7. Remove empty button artifacts if any
content = content.replace(
  `<button className="col-span-2 md:col-span-1" onClick={() => {setSelectedCourse(''); setGradeError(''); setShowGradeModal(true)}}`,
  `<button onClick={() => {setSelectedCourse(''); setGradeError(''); setShowGradeModal(true)}}`
);

fs.writeFileSync(filePath, content);
console.log('Mobile features injected!');
