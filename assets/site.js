(() => {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");
  const header = document.querySelector("[data-site-header]");
  const toast = document.querySelector("[data-toast]");
  let toastTimer = null;

  const citations = {
    posh:
      "Stack, Jason, and Nathan Williams. \u201cPosh Parking Spaces.\u201d arXiv:2610.07280 [math.CO], 2026.",
    parking:
      "Stack, Jason. “Parking Spaces for Complex Reflection Groups.” arXiv:2502.01970 [math.CO], 2025.",
    cayley:
      "Banaian, Esther, Anh Trong Nam Hoang, Elizabeth Kelley, Weston Miller, Jason Stack, Carolyn Stephen, and Nathan Williams. “An Elaborate New Proof of Cayley’s Formula.” Algebraic Combinatorics 8, no. 4 (2025): 971–995. https://doi.org/10.5802/alco.429.",
    elliptic:
      "Hatley, Jeffrey, and Jason Stack. “Two Infinite Families of Elliptic Curves with Rank Greater Than One.” INTEGERS 22 (2022): A1."
  };

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2300);
  }

  function preferredTheme() {
    let stored = null;
    try {
      stored = window.localStorage.getItem("site-theme");
    } catch {
      stored = null;
    }
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeButton) {
      const isDark = theme === "dark";
      themeButton.setAttribute("aria-pressed", String(isDark));
      themeButton.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      themeButton.querySelector("[data-theme-icon]").innerHTML = isDark
        ? '<path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42"/><circle cx="12" cy="12" r="4"/>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>';
    }
  }

  applyTheme(preferredTheme());

  themeButton?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      window.localStorage.setItem("site-theme", next);
    } catch {
      // Theme persistence can be blocked in private or embedded browsing contexts.
    }
    applyTheme(next);
  });

  function closeMenu() {
    navLinks?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }

  menuButton?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("is-open") ?? false;
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navLinks?.classList.contains("is-open")) return;
    if (navLinks.contains(event.target) || menuButton?.contains(event.target)) return;
    closeMenu();
  });

  function updateHeader() {
    header?.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      document.querySelectorAll("[data-publication]").forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.kind !== filter;
      });
    });
  });

  document.querySelectorAll("[data-publication-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      // Preserve the browser's normal behavior for new-tab and modified clicks.
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      const card = document.getElementById(href.slice(1));
      if (!card?.matches("[data-publication]")) return;
      if (card.hidden) document.querySelector('[data-filter="all"]')?.click();
      card.closest(".reveal")?.classList.add("is-visible");
      card.focus({ preventScroll: true });
      // Native anchor navigation (or the standalone preview) handles scrolling.
    });
  });

  document.querySelectorAll("[data-citation]").forEach((button) => {
    button.addEventListener("click", async () => {
      const citation = citations[button.dataset.citation];
      if (!citation) return;
      try {
        await navigator.clipboard.writeText(citation);
        showToast("Citation copied to the clipboard.");
      } catch {
        const field = document.createElement("textarea");
        field.value = citation;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        field.remove();
        showToast("Citation copied to the clipboard.");
      }
    });
  });

  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.querySelector(button.dataset.copyTarget);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent);
        showToast("Source code copied to the clipboard.");
      } catch {
        showToast("Copying was blocked by the browser.");
      }
    });
  });


  const parkingSvg = document.querySelector("[data-parking-svg]");
  const parkingRandomizeButton = document.querySelector("[data-model-randomize]");
  const parkingModelDescription = document.querySelector("[data-model-description]");

  if (parkingSvg) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const TAU = Math.PI * 2;
    const center = { x: 280, y: 280 };
    const outerRadius = 202;
    const innerRadius = 78;
    const outerSectorOrder = [1, 3, 2];
    const innerSectorOrder = [1, 2, 3];
    const colorClass = {
      1: "color-one",
      2: "color-two",
      3: "color-three"
    };
    // Each base pattern partitions 1,...,9 into blocks whose sizes are multiples of k=3.
    // Reading clockwise, every block has consecutive residue classes modulo 3; color rotation
    // produces its two companions, and every visible outer block ends at 0 modulo 3 so the
    // three inner blocks {10,11,12} have the alignment required by Definition 7.1(5).
    const patterns = [
      {
        name: "three outer block orbits",
        blocks: [[1, 2, 6], [3, 4, 5], [7, 8, 9]]
      },
      {
        name: "three nested outer block orbits",
        blocks: [[1, 5, 6], [2, 3, 4], [7, 8, 9]]
      },
      {
        name: "three fan-shaped outer block orbits",
        blocks: [[1, 2, 9], [3, 4, 5], [6, 7, 8]]
      },
      {
        name: "two outer block orbits",
        blocks: [[1, 2, 3, 4, 5, 6], [7, 8, 9]]
      },
      {
        name: "two reversed outer block orbits",
        blocks: [[1, 2, 3], [4, 5, 6, 7, 8, 9]]
      },
      {
        name: "one outer block orbit",
        blocks: [[1, 2, 3, 4, 5, 6, 7, 8, 9]]
      }
    ];
    let previousModelKey = "";

    function createSvgElement(tagName, attributes = {}, textContent = "") {
      const element = document.createElementNS(SVG_NS, tagName);
      Object.entries(attributes).forEach(([name, value]) => {
        element.setAttribute(name, String(value));
      });
      if (textContent) element.textContent = textContent;
      return element;
    }

    function polarPoint(radius, angle) {
      return {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
        angle
      };
    }

    function shuffled(values) {
      const result = values.slice();
      for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
      }
      return result;
    }

    function blockCentroid(points) {
      return points.reduce(
        (sum, point) => ({ x: sum.x + point.x / points.length, y: sum.y + point.y / points.length }),
        { x: 0, y: 0 }
      );
    }

    function insetTowardCenter(point, inset) {
      const dx = point.x - center.x;
      const dy = point.y - center.y;
      const length = Math.hypot(dx, dy) || 1;
      const targetLength = Math.max(0, length - inset);
      return {
        x: center.x + (dx / length) * targetLength,
        y: center.y + (dy / length) * targetLength
      };
    }

    function addBlockLabel(layer, point, labels) {
      // Preserve a separate color class for every label value. The same block can
      // therefore display differently colored numbers without coloring its hull.
      const group = createSvgElement("g", { "aria-hidden": "true" });
      const labelText = labels.map(({ value }) => String(value)).join("·");
      const width = Math.max(22, labelText.length * 5.2 + 12);
      const height = 18;
      group.appendChild(createSvgElement("rect", {
        x: point.x - width / 2,
        y: point.y - height / 2,
        width,
        height,
        rx: 9,
        class: "parking-block-label-bg"
      }));
      const text = createSvgElement("text", {
        x: point.x,
        y: point.y + 0.4,
        class: "parking-block-label"
      });
      labels.forEach(({ value, color }, index) => {
        if (index > 0) text.appendChild(createSvgElement("tspan", {}, "·"));
        text.appendChild(createSvgElement("tspan", {
          class: `parking-label-value ${colorClass[color]}`,
          "data-label-value": value,
          "data-color-class": color
        }, String(value)));
      });
      group.appendChild(text);
      layer.appendChild(group);
    }

    function chooseModel() {
      let choice;
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const patternIndex = Math.floor(Math.random() * patterns.length);
        const labels = shuffled([1, 2, 3]);
        const key = `${patternIndex}:${labels.join("")}`;
        choice = { patternIndex, pattern: patterns[patternIndex], labels, key };
        if (key !== previousModelKey) break;
      }
      previousModelKey = choice.key;
      return choice;
    }

    function renderParkingModel() {
      const choice = chooseModel();
      const rotation = (-Math.PI / 2) + ((Math.random() - 0.5) * Math.PI) / 28;
      const outerPositions = Array.from({ length: 27 }, (_, index) =>
        polarPoint(outerRadius, rotation + (index * TAU) / 27)
      );
      const innerPositions = Array.from({ length: 9 }, (_, index) =>
        polarPoint(innerRadius, rotation - (index * TAU) / 9)
      );

      const title = createSvgElement("title", {}, "3-noncrossing G(3,3,4) parking function");
      const description = createSvgElement(
        "desc",
        {},
        `An annular parking-function model with 27 outer vertices, 9 inner vertices, ${choice.pattern.name}, three color classes on the nodes and individual block-label numbers in place of superscripts, and neutral block hulls.`
      );
      const guideLayer = createSvgElement("g", { "aria-hidden": "true" });
      const blockLayer = createSvgElement("g", { "aria-hidden": "true" });
      const blockLabelLayer = createSvgElement("g", { "aria-hidden": "true" });
      const nodeLayer = createSvgElement("g", { "aria-hidden": "true" });

      guideLayer.appendChild(createSvgElement("circle", {
        cx: center.x,
        cy: center.y,
        r: outerRadius + 4,
        class: "parking-annulus"
      }));
      guideLayer.appendChild(createSvgElement("circle", {
        cx: center.x,
        cy: center.y,
        r: innerRadius + 8,
        class: "parking-inner-guide"
      }));

      for (let sector = 0; sector < 3; sector += 1) {
        const angle = rotation + ((sector * 9 - 0.5) * TAU) / 27;
        const start = polarPoint(innerRadius + 28, angle);
        const end = polarPoint(outerRadius + 15, angle);
        guideLayer.appendChild(createSvgElement("line", {
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          class: "parking-sector-guide"
        }));
      }

      const labelGroups = [];
      let labelCursor = 0;
      choice.pattern.blocks.forEach((block) => {
        const labelCount = block.length / 3;
        labelGroups.push(choice.labels.slice(labelCursor, labelCursor + labelCount));
        labelCursor += labelCount;
      });

      outerSectorOrder.forEach((color, sectorIndex) => {
        choice.pattern.blocks.forEach((block, blockIndex) => {
          const positionIndices = block.map((value) => sectorIndex * 9 + value - 1);
          const points = positionIndices.map((index) => outerPositions[index]);
          blockLayer.appendChild(createSvgElement("polygon", {
            points: points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" "),
            class: "parking-block"
          }));

          const localSpan = Math.max(...block) - Math.min(...block);
          const inset = block.length === 3 && localSpan <= 2 ? 14 : 16;
          const labelPoint = insetTowardCenter(blockCentroid(points), inset);
          const labels = labelGroups[blockIndex];
          addBlockLabel(
            blockLabelLayer,
            labelPoint,
            labels.map((value) => ({ value, color }))
          );
        });
      });

      innerSectorOrder.forEach((color, sectorIndex) => {
        const indices = [sectorIndex * 3, sectorIndex * 3 + 1, sectorIndex * 3 + 2];
        const points = indices.map((index) => innerPositions[index]);
        blockLayer.appendChild(createSvgElement("polygon", {
          points: points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" "),
          class: "parking-block"
        }));
        addBlockLabel(blockLabelLayer, insetTowardCenter(blockCentroid(points), 8), [{ value: 4, color }]);
      });

      outerSectorOrder.forEach((color, sectorIndex) => {
        const className = colorClass[color];
        for (let localIndex = 0; localIndex < 9; localIndex += 1) {
          const index = sectorIndex * 9 + localIndex;
          const point = outerPositions[index];
          const labelPoint = polarPoint(outerRadius + 24, point.angle);
          nodeLayer.appendChild(createSvgElement("circle", {
            cx: point.x,
            cy: point.y,
            r: 5.4,
            class: `parking-node ${className}`
          }));
          nodeLayer.appendChild(createSvgElement("text", {
            x: labelPoint.x,
            y: labelPoint.y,
            class: `parking-node-label ${className}`
          }, String(localIndex + 1)));
        }
      });

      innerSectorOrder.forEach((color, sectorIndex) => {
        const className = colorClass[color];
        for (let localIndex = 0; localIndex < 3; localIndex += 1) {
          const index = sectorIndex * 3 + localIndex;
          const point = innerPositions[index];
          const labelPoint = polarPoint(innerRadius + 27, point.angle);
          nodeLayer.appendChild(createSvgElement("circle", {
            cx: point.x,
            cy: point.y,
            r: 5.4,
            class: `parking-node ${className}`
          }));
          nodeLayer.appendChild(createSvgElement("text", {
            x: labelPoint.x,
            y: labelPoint.y,
            class: `parking-node-label ${className}`
          }, String(localIndex + 10)));
        }
      });

      const centerNote = createSvgElement("text", {
        x: center.x,
        y: center.y + 2,
        class: "parking-center-note",
        "aria-hidden": "true"
      }, "INNER");

      parkingSvg.replaceChildren(title, description, guideLayer, blockLayer, blockLabelLayer, nodeLayer, centerNote);
      parkingSvg.classList.remove("is-refreshing");

      if (parkingModelDescription) {
        parkingModelDescription.setAttribute(
          "aria-label",
          `A 3-noncrossing G(3,3,4)-parking function with ${choice.pattern.name}.`
        );
      }
    }

    renderParkingModel();

    parkingRandomizeButton?.addEventListener("click", () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        renderParkingModel();
        return;
      }
      parkingSvg.classList.add("is-refreshing");
      window.setTimeout(renderParkingModel, 130);
    });
  }

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
