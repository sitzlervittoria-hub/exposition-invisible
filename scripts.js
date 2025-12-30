

// SMOOTH SCROLL (LENIS)
const lenis = new Lenis({
  smooth: true,
  lerp: 0.08, // fluidité du scroll
});

window.lenis = lenis;


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

//animateHero();
//loadProjects();

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

//animateHero();
//loadProjects();

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
      const fab = document.getElementById("fab-media");
      if (fab) {
        fab.classList.add("is-visible");
      }

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

  gsap.set(cursor, { xPercent: -50, yPercent: -50 });

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
  //document.querySelectorAll("a").forEach((link) => {
    //link.addEventListener("mouseenter", cursorGrow);
    //link.addEventListener("mouseleave", cursorNormal);
  //});

  const clickableSelectors = `
    a,
    button,
    .image-item,
    .image-item-container,
    .enfant-bouton-full,
    img[onclick],
    .audio-link,
    .video-link
  `;

  document.querySelectorAll(clickableSelectors).forEach(el => {
    el.addEventListener("mouseenter", cursorGrow);
    el.addEventListener("mouseleave", cursorNormal);
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



function cursorZoomOn() {
  const cursor = document.getElementById("custom-cursor");
  if (!cursor) return;

  gsap.to(cursor, {
    width: 60,
    height: 60,
    duration: 0.25,
    ease: "power3.out"
  });
}

function cursorZoomOff() {
  const cursor = document.getElementById("custom-cursor");
  if (!cursor) return;

  gsap.to(cursor, {
    width: 20,
    height: 20,
    duration: 0.25,
    ease: "power3.out"
  });
}


function openModal(element) {
  // 1) bon modal (celui de oeuvres.html)
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const caption = document.getElementById("modalCaption");
  if (!modal || !modalImg || !caption) return;

  // 2) si tu cliques sur une div, on récupère l'image dedans
  let img = null;
  if (element.tagName === "IMG") img = element;
  else img = element.querySelector("img");
  if (!img) return;

  // 3) ouvrir le modal
  modal.style.display = "flex";
  modalImg.src = img.src;
  modalImg.alt = img.alt || "";

  // 4) caption (si disponible)
  const capEl = element.querySelector(".image-caption");
  caption.textContent = capEl ? capEl.textContent : (img.alt || "");

  // 5) ✅ activer curseur zoom
  cursorZoomOn();
}

// --- fermeture modal + reset curseur ---
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const closeBtn = document.querySelector("#imageModal .close");
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      cursorZoomOff();
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      cursorZoomOff();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
      modal.style.display = "none";
      cursorZoomOff();
    }
  });
});

// bouton écouter enregistrement 4'33"
let audio433 = null;
let is433Playing = false;

function toggle433Audio() {
  if (!audio433) {
    audio433 = new Audio("images/433_audio.mp3");
    audio433.loop = false;

    audio433.onended = function () {
      is433Playing = false;
      update433AudioUI();
    };
  }

  if (!is433Playing) {
    audio433.play();
    is433Playing = true;
  } else {
    audio433.pause();
    is433Playing = false;
  }

  update433AudioUI();
}

function update433AudioUI() {
  const button = document.getElementById("audio433Button");
  if (!button) return;

  if (is433Playing) {
    button.textContent = "⏸ Mettre en pause";
    button.classList.add("playing");
  } else {
    button.textContent = "▶ Écouter l’enregistrement";
    button.classList.remove("playing");
  }
}


// modification problème de clic sur index.html

// ===== MODAL + SCROLL LOCK (SANS LENIS) =====
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("close-modal");
  const title = document.getElementById("modal-title");
  const text = document.getElementById("modal-text");

  if (!modal) return;

  let scrollY = 0;

  function openModal(img) {
    scrollY = window.scrollY || 0;

    title.innerHTML = img.dataset.title || "";
    text.innerHTML = img.dataset.text || "";

    modal.classList.remove("hidden");

    document.body.classList.add("is-locked");
    document.body.style.top = `-${scrollY}px`;
  }

  function closeModal() {
    modal.classList.add("hidden");

    document.body.classList.remove("is-locked");
    document.body.style.top = "";

    window.scrollTo(0, scrollY);
  }

  document.querySelectorAll(".zoom-img").forEach(img => {
    img.addEventListener("click", () => openModal(img));
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
});



// ===== LOCK / UNLOCK SCROLL (ultra fiable) =====
let _scrollY = 0;

function lockScroll() {
  _scrollY = window.scrollY || document.documentElement.scrollTop || 0;
  document.body.classList.add("is-locked");
  document.body.style.top = `-${_scrollY}px`;

  // Si Lenis existe, on le stoppe aussi
  if (window.lenis && typeof window.lenis.stop === "function") {
    window.lenis.stop();
    window.lenis = lenis;

  }
}


function unlockScroll() {
  document.body.classList.remove("is-locked");
  document.body.style.top = "";

  window.scrollTo(0, _scrollY);

  if (window.lenis && typeof window.lenis.start === "function") {
    window.lenis.start();
  }
}


// ===== FORCE SCROLL DANS LE MODAL (FALLBACK ULTIME) =====
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const scrollZone = modal?.querySelector(".modal-scroll");

  if (!modal || !scrollZone) {
    console.warn("⚠️ modal ou modal-scroll introuvable");
    return;
  }

  modal.addEventListener("wheel", (e) => {
    // empêcher le scroll global
    e.preventDefault();

    // forcer le scroll de la zone texte
    scrollZone.scrollTop += e.deltaY;
  }, { passive: false });
});

// Bouton flottant

const mediaMap = {
  "section-433": {
    type: "audio",
    labelPlay: "▶ Écouter 4’33’’",
    labelPause: "⏸ Pause 4’33’’",
    src: "images/433_audio.mp3"
  },
  "section-derecho": {
    type: "audio",
    labelPlay: "▶ Écouter El derecho de vivir en paz",
    labelPause: "⏸ Pause",
    src: "images/derecho_audio.mp3"
  },
  "section-video-433": {
    type: "video",
    labelPlay: "▶ Voir la vidéo 4’33’’",
    url: "https://www.youtube.com/watch?v=XXXX"
  },
  "section-video-derecho": {
    type: "video",
    labelPlay: "▶ Voir la vidéo",
    url: "https://www.youtube.com/watch?v=YYYY"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("floating-media-button");
  if (!button) return;

  let currentAudio = null;
  let currentConfig = null;

  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
      button.classList.remove("playing");
    }
  }

  function updateButton(config) {
    button.classList.remove("hidden");
    button.textContent = config.labelPlay;
    button.onclick = () => {
      if (config.type === "audio") {
        if (!currentAudio) {
          currentAudio = new Audio(config.src);
          currentAudio.onended = stopAudio;
        }

        if (currentAudio.paused) {
          currentAudio.play();
          button.textContent = config.labelPause;
          button.classList.add("playing");
        } else {
          stopAudio();
          button.textContent = config.labelPlay;
        }
      }

      if (config.type === "video") {
        window.open(config.url, "_blank");
      }
    };
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const config = mediaMap[entry.target.id];
          if (!config) return;

          stopAudio();
          currentConfig = config;
          updateButton(config);
        }
      });
    },
    { threshold: 0.6 }
  );

  Object.keys(mediaMap).forEach(id => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
});

// ===== BOUTON AUDIO / VIDÉO FIXE =====
// ===== FAB MEDIA : menu + audio =====
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("fab-toggle");
  const menu = document.getElementById("fab-menu");
  const fab = document.getElementById("fab-media");

  const btn433 = document.getElementById("fab-audio-433");
  const btnDerecho = document.getElementById("fab-audio-derecho");

  if (!toggle || !menu || !fab) return;

  let currentAudio = null;
  let currentButton = null;

  function openMenu() {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "×";
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "+";
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (menu.classList.contains("is-open")) closeMenu();
    else openMenu();
  });

  // fermer si clic ailleurs
  document.addEventListener("click", (e) => {
    if (!fab.contains(e.target)) closeMenu();
  });

  // fermer avec Echap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if (currentButton) {
      currentButton.classList.remove("playing");
      if (currentButton === btn433) currentButton.textContent = "▶ Écouter 4’33’’";
      if (currentButton === btnDerecho) currentButton.textContent = "▶ Écouter El derecho";
      currentButton = null;
    }
  }

  function toggleAudio(button, src, labelPlay, labelPause) {
    // si on clique sur le même bouton et que ça joue => pause
    if (currentButton === button && currentAudio && !currentAudio.paused) {
      stopAudio();
      return;
    }

    // sinon, on coupe l'éventuel audio en cours
    stopAudio();

    currentAudio = new Audio(src);
    currentButton = button;

    currentAudio.onended = stopAudio;

    currentAudio.play().then(() => {
      button.classList.add("playing");
      button.textContent = labelPause;
    }).catch((err) => {
      // Si le navigateur bloque (autoplay policy), tu verras l'erreur ici
      console.error("Audio play error:", err);
      stopAudio();
    });
  }

  if (btn433) {
    btn433.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleAudio(
        btn433,
        "images/433_audio.mp3",            // ✅ mets ton vrai fichier
        "▶ Écouter 4’33’’",
        "⏸ Pause 4’33’’"
      );
    });
  }

  if (btnDerecho) {
    btnDerecho.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleAudio(
        btnDerecho,
        "images/Victor Jara - El Derecho de Vivir en Paz (audio oficial).mp3",        // ✅ mets ton vrai fichier
        "▶ Écouter El derecho",
        "⏸ Pause"
      );
    });
  }
});

