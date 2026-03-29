const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/app/dashboard/page.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Replacing structural classes
code = code.replace(/bg-gray-50/g, 'bg-light');
code = code.replace(/bg-white rounded-2xl shadow-sm border border-gray-100/g, 'bg-white border text-primary border-primary rounded-none shadow-none');
code = code.replace(/bg-white rounded-xl border border-gray-100/g, 'bg-white border text-primary border-primary rounded-none shadow-none');
code = code.replace(/bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-primary\/40 hover:shadow-md/g, 'bg-white p-6 border text-primary border-primary hover:bg-primary hover:text-light transition-colors');
code = code.replace(/bg-white p-4 rounded-xl border border-gray-50 hover:border-gray-100 hover:shadow-sm/g, 'bg-white p-4 border-b border-primary/20 hover:border-primary transition-colors');
code = code.replace(/bg-gray-50 rounded-xl p-12 border border-gray-100 text-center/g, 'bg-transparent border border-primary p-12 text-center');

// Typography
code = code.replace(/text-2xl font-serif font-bold text-primary/g, 'text-4xl font-serif tracking-tighter uppercase text-primary border-b border-primary/20 pb-4 mb-8');
code = code.replace(/text-gray-800/g, 'text-primary');
code = code.replace(/text-gray-700/g, 'text-primary/90');
code = code.replace(/text-gray-600/g, 'text-primary/80');
code = code.replace(/text-gray-500/g, 'text-primary/60');
code = code.replace(/text-gray-400/g, 'text-primary/40');
code = code.replace(/font-medium/g, 'font-medium tracking-wide');

// Dashboard specifics
code = code.replace(/bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg/g, 'bg-primary text-light p-8 border border-primary relative overflow-hidden');
code = code.replace(/bg-gradient-to-br from-green-500 to-emerald-700 text-white p-6 rounded-xl shadow-lg/g, 'bg-secondary text-light p-8 border border-secondary relative overflow-hidden');
code = code.replace(/rounded-full/g, 'rounded-none');
code = code.replace(/rounded-lg/g, 'rounded-none');
code = code.replace(/rounded-xl/g, 'rounded-none');
code = code.replace(/rounded-2xl/g, 'rounded-none');
code = code.replace(/shadow-sm/g, '');
code = code.replace(/shadow-md/g, '');
code = code.replace(/shadow-lg/g, '');
code = code.replace(/shadow-xl/g, '');
code = code.replace(/shadow-2xl/g, '');

// Inputs & Buttons
code = code.replace(/p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary outline-none/g, 'border-b border-primary bg-transparent text-xs uppercase tracking-widest font-bold text-primary pb-1 outline-none mr-2');
code = code.replace(/px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg/g, 'btn-primary py-2 px-6 text-xs');
code = code.replace(/bg-primary text-white p-2 rounded-lg/g, 'bg-primary text-light p-2 transition-colors');
code = code.replace(/w-6 h-6 rounded-full border-2/g, 'w-6 h-6 border-2 border-primary');
code = code.replace(/bg-green-500 border-green-500/g, 'bg-primary border-primary text-light');
code = code.replace(/w-2.5 h-2.5 bg-white rounded-full/g, 'w-3 h-3 bg-light');

// Tab colors
code = code.replace(/bg-primary text-white shadow-md/g, 'bg-primary text-light px-4 border border-primary');
code = code.replace(/hover:bg-gray-50 hover:text-primary/g, 'hover:bg-primary/5 hover:text-primary px-4');

fs.writeFileSync(filePath, code);
console.log('Dashboard redesigned!');
