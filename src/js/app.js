import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger.js";
import TextPlugin from "gsap/TextPlugin.js";

import awards from "./data/awards.js";
import movies from "./data/movies.js";
import images from "./data/images.js";

// styles
import "../scss/style.scss";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

ScrollTrigger.defaults({
  scroller: "#content",
});

const STORE = `https://firebasestorage.googleapis.com/v0/b/bhumi-c428f.appspot.com/o/`;
const formatURL = (file) => STORE + encodeURIComponent(file) + "?alt=media";

function addVideoSrc() {
  const v = document.querySelector(".hero_video video");
  v.src = formatURL("video/intro.mp4");
}

function addFooterLinkAnimation() {
  const links = document.querySelectorAll(".link");
  const enter = (e) => {
    gsap.fromTo(
      e.target.children[0],
      { x: "-100%", opacity: 1 },
      { x: "100%", opacity: 0.5 }
    );
  };
  const leave = (e) => {
    gsap.set(e.target.children[0], { x: "-100%" });
  };

  links.forEach((l) => {
    l.onmouseenter = enter;
    l.onmouseleave = leave;
  });
}

function addTable() {
  const tableContainer = document.querySelector(".awards");
  // console.log(awards);
  awards.forEach((aw) => {
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.innerText = aw.show;
    table.appendChild(caption);

    aw.years.forEach((y) => {
      y.awards.forEach((ev) => {
        const tr = document.createElement("tr");
        // console.log(ev, y.year);
        const year = document.createElement("td");
        year.textContent = y.year;

        const result = document.createElement("td");
        result.innerHTML = `<strong>${ev.outcome}</strong>, ${ev.category}`;

        const des = document.createElement("td");
        const m = ev.movie !== "NA" ? ", " + ev.movie : "";
        des.textContent = `${ev.description} ${m}`;

        tr.appendChild(year);
        tr.appendChild(result);
        tr.appendChild(des);

        table.appendChild(tr);
      });
    });

    tableContainer.appendChild(table);
  });
}

function addMovies() {
  const imageContainer = document.querySelector(".fs-images");
  const titleContainer = document.querySelector(".fs-titles");

  movies.map((m) => {
    const img = document.createElement("img");
    img.classList.add("fs-img");
    img.src = formatURL("posters/" + m.poster);
    img.alt = m.name + " poster";

    const content = `
  <div class="content">
  <h2 class="upper">${m.name}</h2>
  <p>${m.info}</p>
  </div>`;

    imageContainer.appendChild(img);
    titleContainer.innerHTML += content;
  });
}

function addShowcaseTrigger() {
  /**
   * SHOWCASE GRID
   */
  ScrollTrigger.create({
    trigger: ".sc-header",
    pin: true,
    endTrigger: ".awards",
    end: "top 25%",
    pin: true,
    pinSpacing: false,
    // markers: true,
    id: "scGrid",
  });
  const gridT = document.querySelector(".sc-title h2 ");
  const gridTL = new gsap.timeline({
    paused: true,
    defaults: { ease: "expo.out" },
  });

  const items = document.querySelectorAll(".sc-items .item");
  // console.log(items);
  items.forEach((item, ind) => {
    // f s t
    let itemTL = new gsap.timeline({
      // paused: true,
      defaults: {
        ease: "power3.out",
        duration: 0.5,
      },
    });
    itemTL
      .to(item.children[0], { y: "-100%", duration: 1 })
      .fromTo(
        item.children[1],
        { y: "100%" },
        { y: "0%", ease: "sine.out" },
        "<+=15%"
      );

    gridTL.add(itemTL, "-=85%");
  });

  function gridAnimation() {
    gridTL.play();
  }
  function closeGridAnimation() {
    gridTL.pause();
    gridTL.reverse();
  }
  closeGridAnimation();
  gridT.addEventListener("mouseenter", gridAnimation);
  gridT.addEventListener("mouseleave", closeGridAnimation);
}

function addTriggers() {
  /**
   * MAIN LOGO
   */

  var logoTL = new gsap.timeline({
    // repeat: -1,
    // yoyo: true,
    // repeatDelay: 1,
    defaults: {
      transformOrigin: "50% 50%",
      // ease: "power3.out",
    },
    paused: true,
  });

  const logoSVG = document.querySelector("svg.hero_title");

  function calcDim() {
    let { height, width } = logoSVG.getBoundingClientRect();
    let h = height;
    let w = width;
    const aspect = window.innerHeight / window.innerWidth;
    let xtl = new gsap.timeline();
    xtl
      .set("#middle", { y: ((h * 2) / 7) * aspect }, "<")
      .set(
        "#bottom",
        {
          y: ((h * 4) / 7) * aspect,
        },
        "<"
      )
      .to("#M", { x: -(w / 1.8) * aspect }, "<")
      .to("#H", { x: (w / 2) * aspect }, "<")
      .fromTo(
        logoSVG,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
        }
      );
  }

  logoTL
    .to("#loader", {
      opacity: 0,
      duration: 1,
      onComplete() {
        document.querySelector("#loader").remove();
      },
    })
    .to("#M", { x: 0 })
    .to("#H", { x: 0 }, "<")
    .to("#middle", { y: 0 })
    .to("#bottom", {
      y: 0,
    })
    .to(
      ".mini_sub_upper,.mini_sub_italic",
      {
        y: "0%",
        opacity: 1,
        duration: 0.5,
      },
      "-=50%"
    )
    .to(".mini_sub_upper,.mini_sub_italic", {
      opacity: 0,
    })
    .to(
      ".hero_video_curtain",
      {
        y: "100%",
        duration: 1,
        onComplete() {
          logoTL.kill();
          gsap.to("svg.hero_title", {
            opacity: 0,
            scrollTrigger: {
              end: "+=400",
              id: "main-logo",
              // markers: true,
              scrub: true,
            },
          });

          gsap.set("#content", { overflowY: "scroll" });
        },
      },
      "<"
    );

  calcDim();
  /**
   * PREPARE ASSETS
   */

  const heroVid = document.querySelector("video");
  heroVid.addEventListener("loadeddata", () => {
    logoTL.play();
  });

  /**
   * HEADER
   */
  ScrollTrigger.create({
    trigger: "header#nav",
    start: "top top",
    pin: true,
    endTrigger: ".container",
    end: "bottom -370%",
    pinSpacing: false,
    // markers: true,
    id: "header",
  });

  /**
   * SIDE BY SIDE
   */
  let sbsTL = new gsap.timeline({
    defaults: {
      duration: 1.5,
      ease: "back.out(1.2)",
    },
    scrollTrigger: {
      id: "sbs",
      trigger: ".side-by-side",
      toggleActions: "play pause resume reset",
      start: "top 90%",
      end: "bottom 10%",
      // markers: true,
    },
  });

  sbsTL
    .fromTo(
      ".sbs-t",
      {
        opacity: 0,
        delay: 0.2,
      },
      { opacity: 1 },
      "<"
    )
    .to(
      ".img .cover",
      {
        y: "100%",
        transformOrigin: "50% 0%",
        stagger: 0.1,
      },
      "-=30%"
    )
    .fromTo(
      ".img img",
      {
        scale: 1.4,
        transformOrigin: "50% 50%",
      },
      {
        scale: 1,
      },
      "<"
    )
    .fromTo(
      ".sbs-st",
      {
        opacity: 0,
      },
      { opacity: 1 },
      "<"
    );

  /**
   * PARALLAX GALLERY
   */

  ScrollTrigger.create({
    trigger: "#des",
    pin: true,
    start: "top 20%",
    endTrigger: ".gal_img_cont",
    end: "100% 30%",
    toggleActions: "play pause resume none",
    pinSpacing: false,
    // markers: true,
    id: "parallxText",
    scrub: true,
  });

  let parallelTL = new gsap.timeline({
    defaults: {
      duration: 1.2,
      ease: "sine.out",
    },
    scrollTrigger: {
      trigger: ".row.trigger",
      start: "top 50%",
      endTrigger: ".gal_img_cont",
      end: "bottom 100%",
      id: "parallelIMG",
      toggleActions: "play pause resume reset",
      scrub: true,
      // markers: true,
    },
  });

  parallelTL.fromTo(
    ".item_img",
    {
      opacity: 0,
      y: "100%",
    },
    {
      opacity: 1,
      y: "0%",
      stagger: 0.8,
    }
  );

  const adjectives = [
    "Stylish",
    "Humble",
    "Charming",
    "Confident",
    "Bold",
    "Beautiful",
    "Talented",
    "CLIMATE ACTIVIST",
  ];
  const parallaxImages = document.querySelectorAll(".item_img");
  const adjCont = document.querySelector("#des span");
  parallaxImages.forEach((pImg, index) => {
    ScrollTrigger.create({
      trigger: pImg,
      // start: "top 70%",
      // end: "+=500",
      toggleActions: "play pause resume none",
      onEnterBack() {
        adjCont.textContent = adjectives[index];
      },
      onEnter() {
        adjCont.textContent = adjectives[index];
      },
      scrub: true,
    });
  });

  /**
   * FULLSCREEN SWIPER
   */

  var images = gsap.utils.toArray(".fs-img");
  images = images.slice(0, images.length - 1);
  gsap.set(".fs-img", { zIndex: (i, target, targets) => targets.length - i });
  // 4,3,2,1,

  images.forEach((image, i) => {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: "section.fs",
        start: () => "top -" + window.innerHeight * (i + 0.5),
        end: () => "+=" + window.innerHeight,
        scrub: true,
        toggleActions: "play none reverse none",
        invalidateOnRefresh: true,
        //   markers: true,
        // pinSpacing: false,
      },
    });

    tl.to(image, { y: "-100%" });
  });

  gsap.set(".content", { zIndex: (i, target, targets) => i });
  // 5,4,3,2,1
  var texts = gsap.utils.toArray(".content");

  texts.forEach((text, i) => {
    var tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 0.33,
      },
      scrollTrigger: {
        trigger: "section.fs",
        start: () => "top -" + window.innerHeight * i,
        end: () => "+=" + window.innerHeight,
        scrub: true,
        toggleActions: "play none reverse none",
        invalidateOnRefresh: true,
        //   markers: true,
        // pinSpacing: false,
      },
    });

    tl.to(text, { opacity: 1, y: "0%" }).to(
      text,
      {
        opacity: 0,
      },
      "+=300%"
    );
  });

  ScrollTrigger.create({
    trigger: "section.fs",
    scrub: true,
    pin: true,
    start: () => "top top",
    end: () => "+=" + (images.length + 1) * window.innerHeight,
    invalidateOnRefresh: true,
    // markers: true,
  });

  /**
   * MENU BUTTON
   */

  // minilogo
  const miniLogo = document.querySelector("#mini_logo");
  const mi = document.querySelector("#mi");
  function logoAnimation() {
    mi.classList.toggle("slide-down");
  }
  miniLogo.addEventListener("mouseenter", logoAnimation);
  miniLogo.addEventListener("mouseleave", logoAnimation);

  const mb = document.querySelector(".menu_btn");
  const curtain = mb.children[1].children[0];
  const mbTL = new gsap.timeline({ paused: true });

  mbTL
    .fromTo(
      curtain,
      {
        x: "-200%",
        rotation: 45,
      },
      { x: "200%", rotation: 45 }
    )
    .to("#arrow-right", { marginRight: 5 }, "<");

  const menuBtnClose = () => {
    mbTL.reverse();
  };

  mb.addEventListener("mouseenter", () => mbTL.play());
  mb.addEventListener("mouseleave", menuBtnClose);
  // fs-menu

  const fsM = document.querySelector(".fs-menu");
  const fsMClose = document.querySelector(".close");
  const navItems = document.querySelectorAll("a.nav");
  const navMenuTL = new gsap.timeline({
    paused: true,
    defaults: {
      ease: "power3.out",
    },
  });
  navMenuTL.to(fsM, { opacity: 1, pointerEvents: "all" });
  navMenuTL.to(
    ".thumbs",
    { opacity: 1, scale: 1, ease: "power2.out" },
    "-=20%"
  );

  const navA = gsap.utils.toArray("a.nav");
  navA.forEach((nav) => {
    let xTL = new gsap.timeline();
    xTL.to(nav.children[0], { y: "100%", duration: 0.2 }).to(
      nav.children[1].childNodes,
      {
        y: "0%",
        opacity: 1,
        stagger: 0.03,
        ease: "expo.out",
      },
      "<"
    );

    navMenuTL.add(xTL, "-=90%");
  });

  const hideMenuTl = new gsap.timeline({
    paused: true,
  });
  hideMenuTl.to(fsM, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
    pointerEvents: "none",
  });
  const navMenuOpen = () => navMenuTL.restart();
  const navMenuClose = () => hideMenuTl.restart();

  navItems.forEach((item) => {
    item.addEventListener("click", navMenuClose);
  });

  mb.addEventListener("click", navMenuOpen);
  fsMClose.addEventListener("click", navMenuClose);

  /**
   * MENU HOVER EFFECT
   */

  const boxes = document.querySelectorAll(".thumbs img");

  const thumbImages = Array.from(boxes);

  function slide(e) {
    // const i = +e.target.dataset.num;
    const { height } = thumbImages[0].getBoundingClientRect();
    gsap.to(".wrapper", {
      y: -e * height,
      duration: 1,
      ease: "sine.out",
    });
  }
  function slideBegning(e) {
    gsap.to(".wrapper", {
      y: 0,
      duration: 0.9,
      ease: "power3.out",
    });
  }
  slideBegning();
  let navLinks = document.querySelectorAll("a.nav");
  navLinks.forEach((n, index) => {
    n.onmouseenter = () => slide(index + 1);
    n.onmouseleave = slideBegning;
  });

  /**
   * FOOTER
   */
  let fTL = new gsap.timeline({
    scrollTrigger: {
      trigger: ".wall",
      toggleActions: "play pause resume restart",
      start: "top 80%",
      end: "bottom 30%",
      // markers: true,
      scrub: true,
      id: "footer",
    },
  });
  fTL
    .from(".wall img", {
      scale: 1.4,
    })
    .to(
      ".form",
      {
        y: "-50%",
      },
      "<"
    );

  gsap.to("#B,#H,#U,#M,#I", {
    y: 0,
    stagger: 0.05,
    duration: 0.5,
    ease: "power3.out",

    scrollTrigger: {
      trigger: ".footer-content ",
      toggleActions: "play none none reset",
      // end: "+=400px",
      // markers: true,
      id: "f-logo",
    },
  });
}

function addMags() {
  const magContainer = document.querySelector(".mags");
  const magLen = 12;
  for (let i = 1; i <= magLen; i++) {
    const img = document.createElement("img");
    img.src = formatURL("mag/mag (" + i + ").jpg");
    magContainer.appendChild(img);
  }
}

function addIntro() {
  const cont = document.querySelector(".side-by-side#sbs .images");
  const imageWrappers = cont.querySelectorAll(".img");
  images["intro"].map((_, i) => {
    const img = document.createElement("img");
    img.src = formatURL("intro/intro (" + (i + 1) + ").jpg");
    img.classList.add("sbs-img");
    img.alt = "Portrait of Bhumi";
    imageWrappers[i].appendChild(img);
  });
}

function addParallax() {
  const genImage = (name) => {
    const i = document.createElement("img");
    i.src = formatURL("parallax/" + name);
    i.alt = "portrait of bhumi";
    i.classList.add("item_img");
    return i;
  };

  const px = document.querySelector(".gal_img_cont");
  const triggerRow = px.querySelector(".trigger");

  triggerRow.children[0].appendChild(genImage("para (1).jpg"));

  for (let i = 2; i <= 8; i++) {
    const img = genImage(`para (${i}).jpg`);
    const imgMark = img.outerHTML;
    let n = i % 2 === 0;
    const markup = `
    <div class='row'>
    <div class='item'>${n ? "" : imgMark}</div>
    <div class='item'>${n ? imgMark : ""}</div>
    </div>`;

    px.innerHTML += markup;
  }
}

function addFooterWall() {
  const wallCont = document.querySelector(".wall");
  const image = document.createElement("img");
  image.src = formatURL("wall/wall.jpg");
  image.alt = "portrati";
  wallCont.appendChild(image);
}

function addMenu() {
  const cont = document.querySelector(".thumbs .wrapper");

  for (let i = 1; i <= 4; i++) {
    const src = formatURL(`menu/menu (${i}).jpg`);
    const m = `<img data-num=${i} src="${src}" alt="navigation thumbnail">`;
    cont.innerHTML += m;
  }
}

function addPhotoshoot() {
  const itemCont = document.querySelector(".sc-items");
  for (let i = 1; i <= 24; i += 2) {
    const src1 = formatURL(`photoshoot/photo (${i}).jpg`);
    const src2 = formatURL(`photoshoot/photo (${i + 1}).jpg`);
    const markup = `
    <div class='item'>
      <img class='sc-f' src="${src1}" alt='photoshoot item'>
      <img class='sc-f' src="${src2}" alt='photoshoot item'>
    </div>
    `;
    itemCont.innerHTML += markup;
  }
}

function start() {
  //
  addVideoSrc();
  addMenu();
  addParallax();
  addPhotoshoot();
  addFooterWall();
  addMags();
  addIntro();
  addMovies();
  addTable();
  addTriggers();
  addShowcaseTrigger();
  addFooterLinkAnimation();
}

start();
