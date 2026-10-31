import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const base=resolve(process.env.PREVIEW_DIRECTORY || 'dist');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file=resolve(base,'.'+pathname);
    if(!file.startsWith(base+sep)&&file!==base){res.writeHead(403);res.end();return;}
    try {if(!(await stat(file)).isFile())file=resolve(base,'index.html');}catch{file=resolve(base,'index.html');}
    res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(await readFile(file));
  }catch{res.writeHead(500);res.end();}
});
const port=Number(process.env.PORT || 3103);
server.listen(port,'127.0.0.1',()=>console.info(`Static preview http://127.0.0.1:${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
