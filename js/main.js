// Scroll progress bar, scrollspy, reveal-on-scroll, count-up stats.
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll progress bar
  var bar = document.getElementById("progress-bar");
  var onScroll = function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Scrollspy
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("#nav a"));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  var spy = function () {
    var pos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.offsetTop <= pos) current = section;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current.id);
    });
  };
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Project carousel.
  var carousel = document.getElementById("projects-carousel");
  var carouselGoTo = null;
  if (carousel) {
    var carouselSlides = Array.prototype.slice.call(carousel.querySelectorAll(".carousel-slide"));
    var carouselPrev = document.getElementById("carousel-prev");
    var carouselNext = document.getElementById("carousel-next");
    var carouselStatus = document.getElementById("carousel-status");
    var carouselIndex = 0;
    var carouselTotal = carouselSlides.length;

    carouselGoTo = function goTo(index) {
      if (!carouselTotal) return;
      carouselIndex = ((index % carouselTotal) + carouselTotal) % carouselTotal;
      carouselSlides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === carouselIndex);
      });
      if (carouselStatus) {
        carouselStatus.textContent = "Showing project " + (carouselIndex + 1) + " of " + carouselTotal;
      }
    };

    carouselPrev.addEventListener("click", function () {
      carouselGoTo(carouselIndex - 1);
    });
    carouselNext.addEventListener("click", function () {
      carouselGoTo(carouselIndex + 1);
    });

    var touchStartX = 0;
    var touchStartY = 0;
    var touchTracking = false;
    carousel.addEventListener("touchstart", function (e) {
      touchTracking = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    carousel.addEventListener("touchend", function (e) {
      if (!touchTracking) return;
      touchTracking = false;
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) {
          carouselGoTo(carouselIndex + 1);
        } else {
          carouselGoTo(carouselIndex - 1);
        }
      }
    }, { passive: true });

    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        carouselGoTo(carouselIndex + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        carouselGoTo(carouselIndex - 1);
      }
    });

    carouselGoTo(0);
  }
  var carouselGoToProject = null;
  if (carousel) {
    carouselGoToProject = function (id) {
      for (var j = 0; j < carouselSlides.length; j++) {
        if (carouselSlides[j].id === id) {
          carouselGoTo(j);
          return;
        }
      }
    };
  }

  // Interactive terminal in the hero.
  var termBody = document.getElementById("terminal-body");
  var termInput = document.getElementById("t-input");
  var termTyped = document.getElementById("t-typed");
  var termGhost = document.getElementById("t-ghost");
  var termActive = document.getElementById("t-active");

  if (termBody && termInput && termTyped && termGhost && termActive) {
    var cmdHistory = [];
    var histIndex = 0;
    var seedCount = termBody.children.length - 1;
    var projectInfo = {
      musify: [
        "Musify — Python/FastAPI music streamer, hand-scraped backend.",
        "12 passes in — steady-state memory down from ~5MB to ~500KB."
      ],
      neurodesk: [
        "NeuroDesk — desktop app for local LLMs, 1300+ models, zero cloud calls."
      ]
    };
    var reduceMotionPref = reduceMotion;
    var smoothScroll = reduceMotionPref ? "auto" : "smooth";

    function mirrorBuffer() {
      termTyped.textContent = termInput.value;
      termGhost.style.opacity = termInput.value.length ? "0" : "1";
      scrollTerminal();
    }

    function scrollTerminal() {
      termBody.scrollTop = termBody.scrollHeight;
    }

    function renderLine(text, cls) {
      var p = document.createElement("p");
      if (cls) p.className = cls;
      p.textContent = text;
      termBody.insertBefore(p, termActive);
      scrollTerminal();
    }

    function renderPrompt(command) {
      var p = document.createElement("p");
      p.className = "t-line";
      var promptSpan = document.createElement("span");
      promptSpan.className = "prompt";
      promptSpan.textContent = "bhavya@local:~$ ";
      p.appendChild(promptSpan);
      p.appendChild(document.createTextNode(command));
      termBody.insertBefore(p, termActive);
      scrollTerminal();
    }

    function scrollToProject(id, label) {
      renderLine("opening " + label + "...", "t-out");
      var el = document.getElementById(id);
      if (el) {
        if (carouselGoToProject) carouselGoToProject(id);
        el.scrollIntoView({ behavior: smoothScroll, block: "start" });
      }
    }

    function runCommand(raw) {
      var value = (raw || "").trim();
      var lower = value.toLowerCase();

      if (lower === "help") {
        renderLine("commands: ls projects, cat <project>, skills, about, contact, clear", "t-out");
      } else if (lower === "ls" || lower === "ls projects" || lower === "ls projects/") {
        renderLine(Object.keys(projectInfo).map(function (name) { return name + "/"; }).join("   "), "t-out");
      } else if (lower.indexOf("cat ") === 0) {
        var projName = value.slice(4).trim().toLowerCase();
        if (projectInfo[projName]) {
          projectInfo[projName].forEach(function (line) { renderLine(line, "t-out"); });
        } else {
          renderLine("no project named \"" + projName + "\" — run 'ls projects' to list available projects", "t-error");
        }
      } else if (lower === "skills" || lower === "tech-stack") {
        renderLine("python · fastapi · asyncio · javascript · llama.cpp · gguf · websockets", "t-out");
      } else if (lower === "about") {
        renderLine("cs student @ J.C. Bose University of Science and Technology.", "t-out");
        renderLine("builds self-hosted systems and local AI tooling.", "t-out");
      } else if (lower === "contact") {
        renderLine("bhavayagoyal07@gmail.com", "t-out");
      } else if (lower === "clear") {
        while (termBody.children.length > seedCount + 1) {
          termBody.removeChild(termBody.children[seedCount]);
        }
      } else if (lower.indexOf("sudo") === 0) {
        renderLine("nothing to elevate — everything here already runs locally.", "t-out");
      } else if (lower === "open musify") {
        scrollToProject("case-musify", "musify");
      } else if (lower === "open neurodesk") {
        scrollToProject("case-neurodesk", "neurodesk");
      } else if (lower === "") {
        // echo nothing for an empty enter
      } else {
        renderLine("command not found: " + value + " — type 'help' to see available commands", "t-error");
      }
    }

    function submitCommand() {
      var value = termInput.value;
      if (value.length) {
        cmdHistory.push(value);
        renderPrompt(value);
        runCommand(value);
      }
      histIndex = cmdHistory.length;
      termInput.value = "";
      mirrorBuffer();
      termInput.focus({ preventScroll: true });
    }

    termInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        submitCommand();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (histIndex > 0) {
          histIndex -= 1;
          termInput.value = cmdHistory[histIndex];
          mirrorBuffer();
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIndex < cmdHistory.length - 1) {
          histIndex += 1;
          termInput.value = cmdHistory[histIndex];
          mirrorBuffer();
        } else {
          histIndex = cmdHistory.length;
          termInput.value = "";
          mirrorBuffer();
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
      }
    });

    termInput.addEventListener("input", mirrorBuffer);

    termBody.addEventListener("click", function () {
      termInput.focus({ preventScroll: true });
    });

    mirrorBuffer();
    termInput.focus({ preventScroll: true });
  }
})();