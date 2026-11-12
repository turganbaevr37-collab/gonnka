export class Scanner{
 constructor(onImage,onQr){this.video=document.querySelector('#cameraVideo');this.canvas=document.querySelector('#scanCanvas');this.ctx=this.canvas.getContext('2d');this.stream=null;this.onImage=onImage;this.onQr=onQr;this.current=null;this.tool='erase';this.brush=22;this.history=[];this.bind();}
 bind(){
 document.querySelector('#startCamera').onclick=()=>this.start();
 document.querySelector('#capturePhoto').onclick=()=>this.capture();
 document.querySelector('#imageUpload').onchange=e=>{const f=e.target.files[0];if(!f)return;if(!/^image\\/(png|jpeg|webp)$/.test(f.type)){alert('Choose a PNG, JPG or WEBP image.');return;}const im=new Image();im.onload=()=>this.loadImage(im);im.onerror=()=>alert('Could not read image.');im.src=URL.createObjectURL(f);};
 document.querySelector('#brushSize').oninput=e=>this.brush=+e.target.value;
 document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{this.tool=b.dataset.tool;document.querySelectorAll('[data-tool]').forEach(x=>x.classList.toggle('active',x===b));});
 document.querySelector('#autoExtract').onclick=()=>this.removePaper();
 document.querySelector('#rotateImage').onclick=()=>this.rotate();
 document.querySelector('#brightness').oninput=()=>this.adjust();
 document.querySelector('#contrast').oninput=()=>this.adjust();
 const c=document.querySelector('#extractCanvas');let drawing=false,last=null;
 c.addEventListener('pointerdown',e=>{if(!this.current)return;drawing=true;last=this.point(e);c.setPointerCapture(e.pointerId);});
 c.addEventListener('pointermove',e=>{if(!drawing)return;const p=this.point(e);this.paint(last,p);last=p;});
 c.addEventListener('pointerup',()=>drawing=false);c.addEventListener('pointercancel',()=>drawing=false);
 }
 point(e){const r=e.target.getBoundingClientRect();return{x:(e.clientX-r.left)*e.target.width/r.width,y:(e.clientY-r.top)*e.target.height/r.height};}
 async start(){
 try{this.stream?.getTracks().forEach(t=>t.stop());this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});this.video.srcObject=this.stream;document.querySelector('#cameraPlaceholder').style.display='none';const devices=await navigator.mediaDevices.enumerateDevices();const sel=document.querySelector('#cameraSelect');sel.innerHTML='';devices.filter(d=>d.kind==='videoinput').forEach((d,i)=>sel.add(new Option(d.label||`Camera ${i+1}`,d.deviceId)));sel.onchange=async()=>{this.stream.getTracks().forEach(t=>t.stop());this.stream=await navigator.mediaDevices.getUserMedia({video:{deviceId:{exact:sel.value}},audio:false});this.video.srcObject=this.stream;};}
 catch(e){alert('Camera unavailable: '+e.message+'. You can upload a photo instead.');}
 }
 capture(){if(!this.stream||!this.video.videoWidth){alert('Start the camera first.');return;}this.canvas.width=this.video.videoWidth;this.canvas.height=this.video.videoHeight;this.ctx.drawImage(this.video,0,0);this.loadImage(this.canvas);}
 loadImage(source){
 const c=document.querySelector('#extractCanvas'),ctx=c.getContext('2d');const ratio=Math.min(1,1100/source.width,700/source.height);c.width=Math.round(source.width*ratio);c.height=Math.round(source.height*ratio);ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(source,0,0,c.width,c.height);
 this.current=ctx.getImageData(0,0,c.width,c.height);this.history=[];document.querySelector('#previewEmpty').style.display='none';document.querySelector('#registerVehicle').disabled=false;
 const qrCanvas=document.createElement('canvas');qrCanvas.width=c.width;qrCanvas.height=c.height;qrCanvas.getContext('2d').drawImage(c,0,0);const im=qrCanvas.getContext('2d').getImageData(0,0,c.width,c.height);if(window.jsQR){const q=jsQR(im.data,im.width,im.height);if(q){try{const data=JSON.parse(q.data);if(data.templateId)document.querySelector('#scanTemplateId').value=data.templateId;this.onQr?.(data);}catch{}}}
 this.removePaper(false);this.onImage?.();
 }
 removePaper(show=true){
 if(!this.current)return;const d=this.current,dat=d.data,w=d.width,h=d.height;const seen=new Uint8Array(w*h),stack=[];
 const isPaper=i=>{const p=i*4;return dat[p]>220&&dat[p+1]>220&&dat[p+2]>220;};
 for(let x=0;x<w;x++){if(isPaper(x))stack.push(x);let i=(h-1)*w+x;if(isPaper(i))stack.push(i);}
 for(let y=0;y<h;y++){let a=y*w,b=y*w+w-1;if(isPaper(a))stack.push(a);if(isPaper(b))stack.push(b);}
 while(stack.length){const i=stack.pop();if(i<0||i>=w*h||seen[i]||!isPaper(i))continue;seen[i]=1;const x=i%w,y=(i/w)|0;if(x)stack.push(i-1);if(x<w-1)stack.push(i+1);if(y)stack.push(i-w);if(y<h-1)stack.push(i+w);}
 const out=new ImageData(new Uint8ClampedArray(dat),w,h);for(let i=0;i<w*h;i++)if(seen[i])out.data[i*4+3]=0;
 this.current=out;this.render();if(show)window.dispatchEvent(new CustomEvent('rr-toast',{detail:'Paper background removed. Enclosed white details are preserved.'}));
 }
 render(){const c=document.querySelector('#extractCanvas');c.width=this.current.width;c.height=this.current.height;c.getContext('2d').putImageData(this.current,0,0);this.adjust();}
 adjust(){if(!this.current)return;const c=document.querySelector('#extractCanvas'),ctx=c.getContext('2d');ctx.putImageData(this.current,0,0);const b=+document.querySelector('#brightness').value/100,co=+document.querySelector('#contrast').value/100;if(b===1&&co===1)return;const id=ctx.getImageData(0,0,c.width,c.height);for(let i=0;i<id.data.length;i+=4)for(let k=0;k<3;k++)id.data[i+k]=Math.max(0,Math.min(255,((id.data[i+k]-128)*co+128)*b));ctx.putImageData(id,0,0);}
 paint(a,b){const c=document.querySelector('#extractCanvas'),ctx=c.getContext('2d');ctx.save();ctx.globalCompositeOperation=this.tool==='erase'?'destination-out':'source-over';ctx.strokeStyle='rgba(255,255,255,1)';ctx.lineWidth=this.brush;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();this.current=ctx.getImageData(0,0,c.width,c.height);}
 rotate(){if(!this.current)return;const old=this.current,c=document.createElement('canvas');c.width=old.height;c.height=old.width;const x=c.getContext('2d');const t=document.createElement('canvas');t.width=old.width;t.height=old.height;t.getContext('2d').putImageData(old,0,0);x.translate(c.width/2,c.height/2);x.rotate(Math.PI/2);x.drawImage(t,-t.width/2,-t.height/2);this.current=x.getImageData(0,0,c.width,c.height);this.render();}
 exportPng(){if(!this.current)return null;const c=document.createElement('canvas');c.width=this.current.width;c.height=this.current.height;c.getContext('2d').putImageData(this.current,0,0);return c.toDataURL('image/png');}
}
