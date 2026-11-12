const types=[
 ['racer','Racing cars','Speedster'],['sport','Sports cars','Aero GT'],['truck','Trucks','Cargo Pro'],['bus','Buses','City Bus'],['robot','Robots','Robo Runner'],['monster','Monster trucks','Mega Wheels'],['future','Futuristic vehicles','Neo X']
];
export const templates=types.map(([id,category,name],i)=>({id:'TPL-'+id.toUpperCase(),category,name,index:i}));
export function templateSVG(t){
 const wheel=(x)=>`<circle cx="${x}" cy="180" r="24" fill="white" stroke="#111" stroke-width="7"/><circle cx="${x}" cy="180" r="9" fill="white" stroke="#111" stroke-width="4"/>`;
 let body='';
 switch(t.index){
 case 2: body='<path d="M90 105h155v-45h100v45h65l28 42v25H65v-25z"/><rect x="270" y="72" width="66" height="33"/>';break;
 case 3: body='<path d="M75 75h350v95H75z"/><path d="M90 90h55v38H90zm70 0h55v38h-55zm70 0h55v38h-55zm70 0h55v38h-55z" fill="white"/>';break;
 case 4: body='<path d="M95 95l55-40h140l65 40 35 55-30 25H85l-25-25z"/><circle cx="180" cy="110" r="25" fill="white"/><circle cx="300" cy="110" r="25" fill="white"/>';break;
 case 5: body='<path d="M80 135l25-55h90l30-35h75l35 35h55l35 55v35H70z"/>';break;
 case 6: body='<path d="M70 140l45-55 85-35h95l80 35 55 55-30 35H70z"/><path d="M190 90h120l35 45H150z" fill="white"/>';break;
 default: body='<path d="M55 150l35-42 70-12 35-48h105l45 48 75 12 35 42-15 35H65z"/><path d="M195 100l35-37h65l35 37z" fill="white"/>';
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="260" viewBox="0 0 600 260"><rect width="600" height="260" fill="white"/><g fill="none" stroke="#111" stroke-width="8" stroke-linejoin="round" stroke-linecap="round">${body}${wheel(160)}${wheel(390)}<path d="M60 207h480" stroke-width="3"/><path d="M95 158h30m310 0h30" stroke-width="5"/></g><g fill="#111"><rect x="18" y="18" width="22" height="22"/><rect x="560" y="18" width="22" height="22"/><rect x="18" y="220" width="22" height="22"/><rect x="560" y="220" width="22" height="22"/></g><text x="300" y="250" text-anchor="middle" font-family="Arial" font-size="9" fill="#111">ROBOT RACING • COLOUR YOUR VEHICLE</text></svg>`;
}
export function printTemplate(t){
 const id=t.id+'-'+crypto.randomUUID().slice(0,8);
 const qrData=JSON.stringify({templateId:id});
 const svg=templateSVG(t).replace('</svg>',`<text x="300" y="18" text-anchor="middle" font-size="12" fill="#111">TEMPLATE ${id}</text></svg>`);
 const w=window.open('','_blank'); if(!w){alert('Please allow pop-ups to print the template.');return;}
 w.document.write(`<!doctype html><html><head><title>Robot Racing template</title><style>@page{size:A4;margin:12mm}body{font-family:Arial;color:#111}.head{display:flex;justify-content:space-between;align-items:center}.fields{display:flex;gap:24px;margin:15px 0 8px}.fields span{border-bottom:1px solid #111;flex:1;padding:7px 0;font-size:13px}.art{width:100%;height:175mm}.art svg{width:100%;height:100%;object-fit:contain}.foot{display:flex;justify-content:space-between;font-size:10px}</style></head><body><div class="head"><h2>ROBOT RACING — VEHICLE DESIGN</h2><div id="templateQR"></div></div><div class="fields"><span>Student: ____________________</span><span>Class: __________</span></div><div class="fields"><span>Vehicle name: ___________________________________</span></div><div class="art">${svg}</div><div class="foot"><b>Colour your vehicle. Keep the black corner markers visible.</b><span>${id}</span></div><script>window.onload=()=>setTimeout(()=>window.print(),500)<\/script></body></html>`);
 w.document.close();
}
