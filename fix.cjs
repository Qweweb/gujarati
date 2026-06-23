const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');
content = content.replace(/\{\(activeTab === 'all' \|\| activeTab === 'games'\) && \(/g, '{true && (');
content = content.replace(/const TABS = \[[\s\S]*?\];/g, '');
let toolsRegex = /const TOOLS = \[[\s\S]*?\];/g;
content = content.replace(toolsRegex, "const TOOLS = [\n  { icon:'calendar_month',   label:'??????',    path:'/panchang',             bg:'#FFF8EF', iconBg:'#FBBF24', iconClr:'#fff' },\n  { icon:'stars',            label:'??????',    path:'/kundali',              bg:'#F5F3FF', iconBg:'#8B5CF6', iconClr:'#fff' },\n  { icon:'explore',          label:'??????',    path:'/vastu',                bg:'#F0FDFA', iconBg:'#14B8A6', iconClr:'#fff' },\n  { icon:'favorite',         label:'?????????', path:'/health',               bg:'#F0FDF4', iconBg:'#22C55E', iconClr:'#fff' },\n  { icon:'construction',     label:'?????',    path:'/tools',                bg:'#F9FAFB', iconBg:'#6B7280', iconClr:'#fff' },\n  { icon:'badge',            label:'BizCard',  path:'/card',                 bg:'#F0F9FF', iconBg:'#0284C7', iconClr:'#fff' },\n  { icon:'description',      label:'????????', path:'/biodata',              bg:'#EFF6FF', iconBg:'#2563EB', iconClr:'#fff' },\n  { icon:'search',           label:'??????',   path:'/mysteries',            bg:'#FFF1F2', iconBg:'#BE123C', iconClr:'#fff' },\n];");
content = content.replace(/const \[activeTab, setActiveTab\] = useState\('all'\);\r?\n?/g, '');
content = content.replace(/const tools = activeTab === 'all' \? TOOLS : TOOLS\.filter\(t => t\.cat === activeTab\);/g, 'const tools = TOOLS;');
let z2Start = content.indexOf('{/* ----------------------------------------------------------\r\n          ZONE 2');
if (z2Start === -1) z2Start = content.indexOf('{/* ----------------------------------------------------------\n          ZONE 2');
let z3Start = content.indexOf('{/* ----------------------------------------------------------\r\n          ZONE 3');
if (z3Start === -1) z3Start = content.indexOf('{/* ----------------------------------------------------------\n          ZONE 3');
if (z2Start !== -1 && z3Start !== -1) {
  content = content.substring(0, z2Start) + content.substring(z3Start);
}
fs.writeFileSync('src/components/Dashboard.jsx', content);
