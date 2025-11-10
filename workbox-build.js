import { generateSW } from 'workbox-build';


// Run via: node workbox-build.js


generateSW({
swDest: 'public/sw.js',
globDirectory: 'dist',
globPatterns: [
'**/*.{js,css,html,png,svg,ico,json}'
],
clientsClaim: true,
skipWaiting: true,
runtimeCaching: [
{
urlPattern: ({request}) => request.destination === 'document',
handler: 'NetworkFirst'
},
{
urlPattern: ({request}) => ['script','style'].includes(request.destination),
handler: 'StaleWhileRevalidate'
},
{
urlPattern: ({request}) => request.destination === 'image',
handler: 'CacheFirst'
}
]
}).then(({count, size}) => {
console.log(`Workbox: cached ${count} files (${size} bytes)`);
});