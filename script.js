document.addEventListener("DOMContentLoaded", function () {

  /* =========================================
     1. CUSTOM 3D TILT ENGINE
     ========================================= */
  const tiltElements = document.querySelectorAll(".panel, .roadmap-box, .oval-shape, .project, .tile, .resume-btn, .yt-card");

  tiltElements.forEach((el) => {
    // Mouse Move: Calculate rotation based on cursor position
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // X position within element
      const y = e.clientY - rect.top;  // Y position within element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation (Max 15 degrees)
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      // Apply the 3D Transform
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    // Mouse Leave: Reset to flat state
    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform 0.5s ease";
      el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";

      // Remove transition after it finishes to prevent lag on next entry
      setTimeout(() => {
        el.style.transition = "";
      }, 500);
    });

    // Mouse Enter: clear transition for instant response
    el.addEventListener("mouseenter", () => {
      el.style.transition = "";
    });
  });


  /* =========================================
     2. CUSTOM CURSOR LOGIC
     ========================================= */
  const cursorDot = document.getElementById("cursor-dot");
  const cursorRing = document.getElementById("cursor-ring");

  if (cursorDot && cursorRing) {
    // Move cursor elements
    document.addEventListener("mousemove", (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;

      cursorRing.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 500, fill: "forwards" });
    });

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll("a, button, .tile, .roadmap-box, .project, .social-btn, .name-wrap, .resume-btn, .contact-row, .yt-card");
    
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("hovered");
      });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("hovered");
      });
    });
  }


  /* =========================================
     3. MODAL LOGIC (CONNECT BUTTON)
     ========================================= */
  const openBtn = document.getElementById("open-join");
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("modal-close");

  function openModal() {
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
  }

  function closeModal() {
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Close modal if clicking outside the content area
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }


  /* =========================================
     4. TOGGLE BUTTONS (CONTACT, CERTS, SKILLS)
     ========================================= */
  function createPacket(toggleId, listId, showText, hideText) {
    const btn = document.getElementById(toggleId);
    const list = document.getElementById(listId);

    if (!btn || !list) return;

    btn.addEventListener("click", () => {
      const isHidden = list.style.display === "none" || list.style.display === "";

      if (isHidden) {
        list.style.display = "flex";
        btn.textContent = hideText;
        btn.classList.add("tapped");
        btn.setAttribute("aria-expanded", "true");
      } else {
        list.style.display = "none";
        btn.textContent = showText;
        btn.classList.remove("tapped");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Initialize Toggles
  createPacket("contact-toggle", "contact-list", "Open", "Close");
  createPacket("cert-toggle", "cert-list", "Open", "Close");
  createPacket("skill-toggle", "skill-list", "Open", "Close");


  /* =========================================
     5. ROADMAP ACCORDION
     ========================================= */
  const roadmapBoxes = document.querySelectorAll(".roadmap-box");

  roadmapBoxes.forEach((box) => {
    box.addEventListener("click", (e) => {
      // Prevent closing if clicking inside the topics list (e.g. copying text)
      if (e.target.closest(".topics-list")) return;

      const isAlreadyOpen = box.classList.contains("active");

      // Close all other boxes
      roadmapBoxes.forEach((otherBox) => {
        if (otherBox !== box) {
          otherBox.classList.remove("active");
          const otherBtn = otherBox.querySelector(".roadmap-btn");
          if (otherBtn) otherBtn.textContent = "View";
        }
      });

      // Toggle current box
      const btn = box.querySelector(".roadmap-btn");
      if (isAlreadyOpen) {
        box.classList.remove("active");
        if (btn) btn.textContent = "View";
      } else {
        box.classList.add("active");
        if (btn) btn.textContent = "Close";
      }
    });
  });


  /* =========================================
     6. NAME ANIMATION
     ========================================= */
  const nameWrap = document.getElementById("nameWrap");
  const namePulse = document.getElementById("namePulse");

  if (nameWrap && namePulse) {
    nameWrap.addEventListener("click", () => {
      const pressed = nameWrap.getAttribute("aria-pressed") === "true";
      nameWrap.setAttribute("aria-pressed", String(!pressed));

      // Reset Animation Trick
      namePulse.classList.remove("play");
      void namePulse.offsetWidth; // Trigger Reflow
      namePulse.classList.add("play");
    });
  }

  /* =========================================
     7. CLIPBOARD COPY & TOAST UTILITY
     ========================================= */
  const copyTriggers = document.querySelectorAll(".copy-trigger");
  
  copyTriggers.forEach(trigger => {
    trigger.addEventListener("click", function() {
      const textToCopy = this.getAttribute("data-copy");
      
      if(textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied: ${textToCopy}`);
        }).catch(err => {
          console.error("Failed to copy text: ", err);
          showToast("Failed to copy", true);
        });
      }
    });
  });

  function showToast(message, isError = false) {
    const container = document.getElementById("toast-container");
    if(!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    
    if(isError) {
      toast.style.borderColor = "#ff3333";
      toast.style.color = "#ff3333";
    }

    container.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease-in forwards";
      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }, 3000);
  }

});
const textElement = document.getElementById("typewriter");
const phrases = ["Security Researcher", "Ethical Hacker", "Pentester", "SOC Analyst"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 150;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        // Remove characters
        textElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Faster when deleting
    } else {
        // Add characters
        textElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 150;
    }

    // Logic to switch between typing and deleting
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at the end of the phrase
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400; // Small pause before next word
    }

    setTimeout(type, typeSpeed);
}

// Start the effect
type();
document.addEventListener("DOMContentLoaded", () => {
    // Typewriter Configuration
    const element = document.getElementById("typewriter-role");
    const roles = ["Cyber Security Analyst", "Red Teamer", "Pentester", "Security Researcher"];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIdx];
        
        if (isDeleting) {
            element.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
        } else {
            element.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 50 : 150;

        if (!isDeleting && charIdx === currentRole.length) {
            isDeleting = true;
            speed = 2000; // Pause at end
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 500;
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();
});