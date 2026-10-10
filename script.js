const categories = [
  {name:"Bridal Elegance", first:1, last:20, image:"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80", desc:"Bridal looks & wedding styles"},
  {name:"Designer Blouses", first:21, last:40, image:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80", desc:"Blouse designs & detailing"},
  {name:"Festive Suits", first:41, last:60, image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80", desc:"Festive suits & ethnic wear"},
  {name:"Lehenga Looks", first:61, last:80, image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80", desc:"Lehenga inspiration"},
  {name:"Custom Fitting", first:81, last:100, image:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80", desc:"Saree drapes & custom fit"},
  {name:"Kids Collection", first:101, last:120, image:"https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80", desc:"Little celebrations & kids wear"}
];
const categoryGrid = document.getElementById("categoryGrid");
const modal = document.getElementById("galleryModal");
const styleGrid = document.getElementById("styleGrid");
const modalTitle = document.getElementById("modalTitle");
const modalRange = document.getElementById("modalRange");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const pad = n => String(n).padStart(2,"0");
const styleName = n => `STYLE${pad(n)}`;

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
function imagePath(n){ return `images/${styleName(n)}.jpg`; }
function makeStyleCard(n,cat){
  const card=document.createElement("button");
  card.type="button";
  card.className="style-card";
  card.setAttribute("aria-label",`View ${styleName(n)}`);
  const img=document.createElement("img");
  img.src=imagePath(n);
  img.alt=`${styleName(n)} — ${cat.name}`;
  img.loading="lazy";
  img.onerror=()=>{
    img.remove();
    const fallback=document.createElement("div");
    fallback.className="empty-photo";
    fallback.innerHTML=`<strong>${styleName(n)}</strong><span>ADD YOUR PHOTO</span>`;
    card.insertBefore(fallback,card.firstChild);
  };
  const caption=document.createElement("div");
  caption.className="style-caption";
  caption.innerHTML=`<span>${styleName(n)}</span><span>View photo ↗</span>`;
  card.append(img,caption);
  card.addEventListener("click",()=>{
    const current=card.querySelector("img");
    if(current && current.complete && current.naturalWidth>0){
      lightboxImage.src=current.src;
      lightboxCaption.textContent=`${styleName(n)} · ${cat.name}`;
      lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");
    } else {
      lightboxImage.removeAttribute("src");
      lightboxCaption.textContent=`${styleName(n)} — Add your photo as images/${styleName(n)}.jpg`;
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
document.getElementById("photoUpload").addEventListener("change",event=>{
  const preview=document.getElementById("uploadPreview");
  preview.innerHTML="";
  const files=Array.from(event.target.files||[]).filter(f=>f.type.startsWith("image/"));
  files.forEach((file,index)=>{
    const card=document.createElement("div");card.className="style-card";
    const img=document.createElement("img");img.src=URL.createObjectURL(file);img.alt=file.name;img.loading="lazy";
    const cap=document.createElement("div");cap.className="style-caption";
    cap.innerHTML=`<span>${file.name}</span><span>Preview</span>`;
    card.append(img,cap);card.addEventListener("click",()=>{lightboxImage.src=img.src;lightboxCaption.textContent=file.name;lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");});
    preview.appendChild(card);
  });
  if(files.length===0) preview.innerHTML='<p class="upload-note">No image files selected.</p>';
});
makeCategories();