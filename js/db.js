const DB_NAME='robot-racing-db', DB_VERSION=1;
let dbPromise;
export function db(){
 if(!dbPromise) dbPromise=new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB_NAME,DB_VERSION);
  req.onupgradeneeded=()=>{const d=req.result; for(const s of ['vehicles','races']) if(!d.objectStoreNames.contains(s)) d.createObjectStore(s,{keyPath:'id'});};
  req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
 });
 return dbPromise;
}
export async function all(store){const d=await db();return new Promise((res,rej)=>{const r=d.transaction(store).objectStore(store).getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error);});}
export async function put(store,item){const d=await db();return new Promise((res,rej)=>{const r=d.transaction(store,'readwrite').objectStore(store).put(item);r.onsuccess=()=>res(item);r.onerror=()=>rej(r.error);});}
export async function remove(store,id){const d=await db();return new Promise((res,rej)=>{const r=d.transaction(store,'readwrite').objectStore(store).delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
export async function clearStore(store){const d=await db();return new Promise((res,rej)=>{const r=d.transaction(store,'readwrite').objectStore(store).clear();r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
