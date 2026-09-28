import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../dist');
const prefix='/'+(process.env.BASE_PATH||'').replace(/^\/+|\/+$/g,'');
const base=prefix==='/'?'/':prefix+'/';
const port=Number(process.env.PORT||3007);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml'};
createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 if(base!=='/'&&pathname===prefix){res.writeHead(302,{Location:base});res.end();return;}
 if(!pathname.startsWith(base)){res.writeHead(404);res.end('Not found');return;}
 const relative=pathname.slice(base.length)||'index.html';
 const file=path.resolve(root,relative.endsWith('/')?relative+'index.html':relative);
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 try{if(!(await stat(file)).isFile())throw Error('Not a file');const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Content-Length':bytes.length});res.end(req.method==='HEAD'?undefined:bytes);}catch{res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Preview ready: http://localhost:${port}${base}`));
