

// SMOOTH SCROLL (LENIS)
const lenis = new Lenis({
  smooth: true,
  lerp: 0.08, // fluidité du scroll
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


// Charger les projets depuis l'API backend
async function loadProjects() {
  const res = await fetch("/api/projects");   // <--- on construira cette API après
  const projects = await res.json();

  const container = document.getElementById("projects");

  projects.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h2>${p.title}</h2>
      <p>${p.description}</p>
    `;
    container.appendChild(card);
  });

  animateProjects();
}

// Animation GSAP
function animateProjects() {
  gsap.from(".project-card", {
    opacity: 0,
    y: 80,
    stagger: 0.2,
    duration: 1.2,
    ease: "power4.out",
    scrollTrigger: {
      trigger: "#projects",
      start: "top bottom",
    }
  });
}

// Animation du HERO
function animateHero() {
  gsap.from("#hero-img", {
    scale: 1.2,
    opacity: 0,
    duration: 2,
    ease: "power3.out",
  });
}

animateHero();
loadProjects();

function animateAppearZoom() {
  document.querySelectorAll(".next-img").forEach((img) => {
    gsap.fromTo(
      img,
      {
        scale: 0.2,
        opacity: 0,
        transformOrigin: "center center",
      },
      {
        scale: 1,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: img.closest(".zoom-section"),
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        }
      }
    );
  });
}

function animateImageTransitions() {
  const sections = document.querySelectorAll(".zoom-section");

  sections.forEach((section, i) => {
    const currentImg = section.querySelector(".zoom-img");
    const nextSection = sections[i + 1];
    
    if (!nextSection) return; // skip last section
    
    const nextImg = nextSection.querySelector(".zoom-img");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    // image actuelle zoom OUT
    tl.to(currentImg, {
      scale: 1.3,
      opacity: 0,
      ease: "none"
    });

    // image suivante fade IN + zoom IN
    tl.fromTo(
      nextImg,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, ease: "none" },
      "<" // synchro
    );
  });
}

animateHero();
loadProjects();

animateAppearZoom();      // effet image minuscule → grand écran
animateImageTransitions(); // transitions entre images

// Synchroniser Lenis avec ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});

function animatePreloader() {
  const tl = gsap.timeline();

  tl.from("#loader-text", {
    opacity: 0,
    y: 30,
    duration: 1.2,
    ease: "power3.out"
  });

  tl.to("#loader-text", {
    opacity: 0,
    scale: 1.2,
    duration: 0.8,
    delay: 0.5,
    ease: "power2.inOut"
  });

  tl.to("#preloader", {
    opacity: 0,
    duration: 1,
    ease: "power3.inOut",
    onComplete: () => {
      document.getElementById("preloader").style.display = "none";
    }
  });

  // Quand preload terminé -> lancer animations principales
  tl.add(() => {
    animateHero();
    animateAppearZoom();
    animateImageTransitions();
    revealText();
  });
}

function revealText() {
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
      }
    });
  });
}

animatePreloader();

// Changement du menu quand on scroll
function animateMenu() {
  const menu = document.getElementById("menu");

  ScrollTrigger.create({
    trigger: "#hero",
    start: "bottom top",
    onEnter: () => menu.classList.add("scrolled"),
    onLeaveBack: () => menu.classList.remove("scrolled")
  });
}

animateMenu();

gsap.from("#menu", {
  y: -40,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out"
});

// ===== CURSEUR PERSONNALISÉ =====
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("custom-cursor");
  if (!cursor) return;

  // déplacement avec GSAP
  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.12,
      ease: "power2.out"
    });
  });

  // état normal
  function cursorNormal() {
    gsap.to(cursor, {
      width: 20,
      height: 20,
      duration: 0.2,
      ease: "power3.out"
    });
  }

  // état agrandi sur lien
  function cursorGrow() {
    gsap.to(cursor, {
      width: 40,
      height: 40,
      duration: 0.2,
      ease: "power3.out"
    });
  }

  // appliquer l'effet sur TOUS les liens
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("mouseenter", cursorGrow);
    link.addEventListener("mouseleave", cursorNormal);
  });

  // au début, on garde le curseur normal
  cursorNormal();
});

// Fonction pour basculer l'affichage du rectangle d'explication pour enfants
function toggleEnfantExplication(event) {
  event.stopPropagation(); // Empêcher la propagation du clic
  
  // Cibler le rectangle dans la salle 3
  const explicationRect = document.getElementById("enfant-explication-salle3");
  
  if (explicationRect) {
    // Basculer l'affichage
    if (explicationRect.style.display === "block") {
      explicationRect.style.display = "none";
    } else {
      explicationRect.style.display = "block";
      
      // Faire défiler jusqu'au rectangle pour qu'il soit visible
      explicationRect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
// Fonction pour basculer l'affichage du rectangle d'explication pour la Madeleine
function toggleMadeleineExplication(event) {
  event.stopPropagation(); // Empêcher la propagation du clic
  
  // Cibler le rectangle pour la Madeleine
  const explicationRect = document.getElementById("madeleine-explication");
  
  if (explicationRect) {
    // Fermer les autres rectangles d'explication s'ils sont ouverts
    const salle3Rect = document.getElementById("enfant-explication-salle3");
    if (salle3Rect && salle3Rect.style.display === "block") {
      salle3Rect.style.display = "none";
    }
    
    // Basculer l'affichage
    if (explicationRect.style.display === "block" || explicationRect.style.display === "") {
      explicationRect.style.display = "none";
    } else {
      explicationRect.style.display = "block";
      
      // Faire défiler jusqu'au rectangle pour qu'il soit visible
      explicationRect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
// Fonction pour basculer l'affichage du rectangle d'explication pour enfants (Madame X)
function toggleEnfantExplication(event) {
  event.stopPropagation(); // Empêcher la propagation du clic
  
  // Cibler le rectangle dans la salle 3
  const explicationRect = document.getElementById("enfant-explication-salle3");
  
  if (explicationRect) {
    // Fermer l'autre rectangle s'il est ouvert
    const madeleineRect = document.getElementById("madeleine-explication");
    if (madeleineRect && madeleineRect.style.display === "block") {
      madeleineRect.style.display = "none";
    }
    
    // Basculer l'affichage
    if (explicationRect.style.display === "block" || explicationRect.style.display === "") {
      explicationRect.style.display = "none";
    } else {
      explicationRect.style.display = "block";
      
      // Faire défiler jusqu'au rectangle pour qu'il soit visible
      explicationRect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

// Fonction pour basculer l'affichage du rectangle d'explication pour la salle 1
function toggleSalle1Explication(event) {
  event.stopPropagation(); // Empêcher la propagation du clic
  
  // Cibler le rectangle dans la salle 1
  const explicationRect = document.getElementById("salle1-explication");
  
  if (explicationRect) {
    // Fermer les autres rectangles s'ils sont ouverts
    const salle2Rect = document.getElementById("enfant-explication-salle3");
    const madeleineRect = document.getElementById("madeleine-explication");
    
    if (salle2Rect && salle2Rect.style.display === "block") {
      salle2Rect.style.display = "none";
    }
    if (madeleineRect && madeleineRect.style.display === "block") {
      madeleineRect.style.display = "none";
    }
    
    // Basculer l'affichage
    if (explicationRect.style.display === "block" || explicationRect.style.display === "") {
      explicationRect.style.display = "none";
    } else {
      explicationRect.style.display = "block";
      
      // Faire défiler jusqu'au rectangle pour qu'il soit visible
      explicationRect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

// Fonction pour défiler vers une section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    // Calculer la position avec un offset pour le menu fixe
    const menuHeight = document.querySelector('nav')?.offsetHeight || 100;
    const sectionPosition = section.offsetTop - menuHeight;
    
    // Défiler en douceur
    window.scrollTo({
      top: sectionPosition,
      behavior: 'smooth'
    });
    
    // Fermer le menu déroulant (sur mobile)
    closeAllDropdowns();
    
    // Mettre en surbrillance la section
    section.style.backgroundColor = 'rgba(255, 255, 200, 0.2)';
    setTimeout(() => {
      section.style.backgroundColor = '';
    }, 1500);
  }
}

// Fonction pour fermer tous les menus déroulants
function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown-content');
  dropdowns.forEach(dropdown => {
    dropdown.style.display = 'none';
  });
}

// Fermer les menus déroulants en cliquant ailleurs
document.addEventListener('click', function(event) {
  if (!event.target.closest('.dropdown')) {
    closeAllDropdowns();
  }
});

// Gérer le clic sur les liens du menu déroulant
document.querySelectorAll('.dropdown-content a').forEach(link => {
  link.addEventListener('click', function(e) {
    if (this.getAttribute('href') === '#') {
      e.preventDefault();
    }
  });
});

// ajout en plus 

const images = document.querySelectorAll('.zoom-img');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const closeBtn = document.getElementById('close-modal');

images.forEach(img => {
  img.addEventListener('click', () => {
    modalTitle.textContent = img.dataset.title || '';
    modalText.innerHTML = img.dataset.text;
    modal.classList.remove('hidden');
  });
});

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

modal.classList.remove('hidden');
document.body.classList.add('modal-open');


modal.classList.add('hidden');
document.body.classList.remove('modal-open');
