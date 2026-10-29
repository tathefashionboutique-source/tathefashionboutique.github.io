const categories = [
  {name:"Bridal Elegance", folder:"Bridal Elegance", first:1, last:20, image:"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80", desc:"Bridal looks & wedding styles"},
  {name:"Designer Blouses", folder:"Designer Blouses", first:21, last:40, image:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80", desc:"Blouse designs & detailing"},
  {name:"Festive Suits", folder:"Festive Suits", first:41, last:60, image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80", desc:"Festive suits & ethnic wear"},
  {name:"Lehenga Looks", folder:"Lehenga Looks", first:61, last:80, image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80", desc:"Lehenga inspiration"},
  {name:"Custom Fitting", folder:"Custom Fitting", first:81, last:100, image:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80", desc:"Saree drapes & custom fit"},
  {name:"Kids Collection", folder:"Kids Collection", first:101, last:120, image:"https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80", desc:"Little celebrations & kids wear"}
];
const categoryGrid = document.getElementById("categoryGrid");
const modal = document.getElementById("galleryModal");
const styleGrid = document.getElementById("styleGrid");
const modalTitle = document.getElementById("modalTitle");
const modalRange = document.getElementById("modalRange");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const pad = n => String(n).padStart(3,"0");
const styleName = n => `STYLE${pad(n)}`;
const selectedStyleNumbers = new Set();
function renderSelectedStyles(){const el=document.getElementById("selectedStyles");if(!el)return;el.innerHTML="";if(!selectedStyleNumbers.size){el.textContent="No styles selected yet.";return;}[...selectedStyleNumbers].sort((a,b)=>a-b).forEach(n=>{const chip=document.createElement("button");chip.type="button";chip.className="selected-style-chip";chip.textContent=`${styleName(n)} ×`;chip.title=`Remove ${styleName(n)}`;chip.addEventListener("click",()=>{selectedStyleNumbers.delete(n);renderSelectedStyles();document.querySelectorAll(`[data-style-number="${n}"]`).forEach(c=>c.classList.remove("is-selected"));});el.appendChild(chip);});}

function makeCategories(){
  categories.forEach((cat,index)=>{
    const card=document.createElement("button");
    card.type="button";
    card.className="gallery-card";
    card.style.backgroundImage=`url("${cat.image}")`;
    card.setAttribute("aria-label",`Open ${cat.name} gallery, styles ${styleName(cat.first)} to ${styleName(cat.last)}`);
    card.innerHTML=`<div class="gallery-label"><small>COLLECTION 0${index+1} · ${styleName(cat.first)}–${styleName(cat.last)}</small><h3>${cat.name}</h3><p>${cat.desc} →</p></div>`;
    card.addEventListener("click",()=>openCategory(cat));
    categoryGrid.appendChild(card);
  });
}
function imagePath(n,cat,extension="jpg"){
  return `Images/${styleName(n)}.${extension}`;
}
function makeStyleCard(n,cat){
  const card=document.createElement("button");
  card.type="button";
  card.className="style-card";
  card.dataset.styleNumber=String(n);
  card.setAttribute("aria-label",`Select or view ${styleName(n)}`);
  const img=document.createElement("img");
  img.src=imagePath(n,cat,"jpg");
  img.onerror=()=>{
    if(img.dataset.triedPng!=="yes"){
      img.dataset.triedPng="yes";
      img.src=imagePath(n,cat,"png");
      return;
    }
    img.remove();
    const fallback=document.createElement("div");
    fallback.className="empty-photo";
    fallback.innerHTML=`<strong>${styleName(n)}</strong><span>ADD JPG OR PNG PHOTO</span>`;
    card.insertBefore(fallback,card.firstChild);
  };
  img.alt=`${styleName(n)} — ${cat.name}`;
  img.loading="lazy";
  const caption=document.createElement("div");
  caption.className="style-caption";
  caption.innerHTML=`<span>${styleName(n)}</span><span>View photo ↗</span>`;
  card.append(img,caption);
  card.addEventListener("click",()=>{
    if(selectedStyleNumbers.has(n)){selectedStyleNumbers.delete(n);card.classList.remove("is-selected");}else{selectedStyleNumbers.add(n);card.classList.add("is-selected");}
    renderSelectedStyles();
    const current=card.querySelector("img");
    if(current && current.complete && current.naturalWidth>0){
      lightboxImage.src=current.src;
      lightboxCaption.textContent=`${styleName(n)} · ${cat.name}`;
      lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");
    } else {
      lightboxImage.removeAttribute("src");
      lightboxCaption.textContent=`${styleName(n)} — Add your photo as images/${cat.folder}/${styleName(n)}.jpg or .png`;
      lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");
    }
  });
  return card;
}
function openCategory(cat){
  modalTitle.textContent=cat.name;
  modalRange.textContent=`${styleName(cat.first)} to ${styleName(cat.last)} · ${cat.last-cat.first+1} style slots`;
  styleGrid.innerHTML="";
  for(let n=cat.first;n<=cat.last;n++) styleGrid.appendChild(makeStyleCard(n,cat));
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}
function closeModal(){
  modal.classList.remove("open");modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
document.getElementById("closeModal").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});
document.getElementById("lightboxClose").addEventListener("click",()=>{lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");});
lightbox.addEventListener("click",e=>{if(e.target===lightbox){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");}});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){closeModal();lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");}
});
const menuBtn=document.querySelector(".menu-btn");
const nav=document.getElementById("nav");
menuBtn.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded",String(open));
});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false");}));
document.getElementById("year").textContent=new Date().getFullYear();
// Happy Clients slideshow: GitHub Pages is static, so media filenames are enumerated.
const clientStage=document.getElementById("clientMediaStage");
const clientLabel=document.getElementById("clientSlideLabel");
const clientPhotosBtn=document.getElementById("clientPhotosBtn");
const clientVideosBtn=document.getElementById("clientVideosBtn");
let clientMode="photos", clientIndex=1, clientTimer=null, clientPaused=false;
const clientPad=n=>String(n).padStart(3,"0");
function clientPath(mode,n,ext){return mode==="photos"?`HAPPY%20CLINTS/Pick/HCP${clientPad(n)}.${ext}`:`HAPPY%20CLINTS/Video/HCV${clientPad(n)}.${ext}`;}
function renderClientSlide(){
  if(!clientStage)return;
  clientStage.innerHTML="";
  const n=clientIndex;
  if(clientMode==="photos"){
    const img=document.createElement("img");img.className="client-photo";img.alt=`Happy client photo HCP${clientPad(n)}`;img.src=clientPath("photos",n,"jpg");
    img.onerror=()=>{if(!img.dataset.png){img.dataset.png="1";img.src=clientPath("photos",n,"png");}else{img.remove();showClientEmpty(`HCP${clientPad(n)}`,"Add JPG or PNG photo to HAPPY CLINTS/Pick");}};
    clientStage.appendChild(img);clientLabel.textContent=`HCP${clientPad(n)} · ${n}/100`;
  }else{
    const video=document.createElement("video");video.className="client-video";video.controls=true;video.playsInline=true;video.preload="metadata";video.src=clientPath("videos",n,"mp4");
    video.onerror=()=>{video.remove();showClientEmpty(`HCV${clientPad(n)}`,"Add MP4 video to HAPPY CLINTS/Video");};
    video.addEventListener("ended",()=>nextClientSlide(1));clientStage.appendChild(video);clientLabel.textContent=`HCV${clientPad(n)} · ${n}/100`;
    if(!clientPaused) video.play().catch(()=>{});
  }
}
function showClientEmpty(title,message){const empty=document.createElement("div");empty.className="client-empty";const strong=document.createElement("strong");strong.textContent=title;const span=document.createElement("span");span.textContent=message;empty.append(strong,span);clientStage.appendChild(empty);}
function nextClientSlide(delta){clientIndex=((clientIndex-1+delta+100)%100)+1;renderClientSlide();}
function stopClientTimer(){if(clientTimer){clearInterval(clientTimer);clientTimer=null;}}
function startClientTimer(){stopClientTimer();if(clientPaused)return;clientTimer=setInterval(()=>{if(clientMode==="photos")nextClientSlide(1);else{const v=clientStage.querySelector("video");if(v&&v.ended)nextClientSlide(1);}},5000);}
function setClientMode(mode){clientMode=mode;clientIndex=1;clientPhotosBtn.classList.toggle("active",mode==="photos");clientVideosBtn.classList.toggle("active",mode==="videos");clientPhotosBtn.classList.toggle("btn-gold",mode==="photos");clientPhotosBtn.classList.toggle("btn-outline-dark",mode!=="photos");clientVideosBtn.classList.toggle("btn-gold",mode==="videos");clientVideosBtn.classList.toggle("btn-outline-dark",mode!=="videos");renderClientSlide();startClientTimer();}
clientPhotosBtn?.addEventListener("click",()=>setClientMode("photos"));clientVideosBtn?.addEventListener("click",()=>setClientMode("videos"));
document.getElementById("clientPrev")?.addEventListener("click",()=>nextClientSlide(-1));document.getElementById("clientNext")?.addEventListener("click",()=>nextClientSlide(1));
document.getElementById("clientPlay")?.addEventListener("click",e=>{clientPaused=!clientPaused;e.currentTarget.textContent=clientPaused?"Play slideshow":"Pause slideshow";e.currentTarget.setAttribute("aria-pressed",String(!clientPaused));if(clientPaused){stopClientTimer();const v=clientStage.querySelector("video");if(v)v.pause();}else{startClientTimer();const v=clientStage.querySelector("video");if(v&&clientMode==="videos")v.play().catch(()=>{});}});

makeCategories();
renderSelectedStyles();
setClientMode("photos");
