const V='nu-smart-v1',SHELL=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin===location.origin){ // shell: cache dulu, perbarui di latar
  e.respondWith(caches.match(e.request).then(r=>{const n=fetch(e.request).then(x=>{caches.open(V).then(c=>c.put(e.request,x.clone()));return x}).catch(()=>r);return r||n}));
 }else if(/equran\.id|blogspot|googleusercontent/.test(u.host)){ // data: jaringan dulu, cadangan cache
  e.respondWith(fetch(e.request).then(x=>{if(x.ok)caches.open(V).then(c=>c.put(e.request,x.clone()));return x}).catch(()=>caches.match(e.request)));
 }
});
