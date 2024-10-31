var scrollTop = (document.documentElement || document.body.parentNode || document.body).scrollTop;
var windowWidth = window.innerWidth;
var photos;
var observer;

window.addEventListener("load", () => {
  const analog_together = document.getElementById("analog_together");
  const andrew = document.getElementById("andrew");
  const cos_dinner = document.getElementById("cos_dinner");
  const ethan = document.getElementById("ethan");
  const funny = document.getElementById("funny");
  const funny0 = document.getElementById("funny0");
  const nethra_br = document.getElementById("nethra_br");
  const nethra_tea = document.getElementById("nethra_tea");
  const noah_tea1 = document.getElementById("noah_tea1");
  const noah_tea3 = document.getElementById("noah_tea3");
  const noah_tea4 = document.getElementById("noah_tea4");
  const raisa_tea_smile = document.getElementById("raisa_tea_smile");
  const raisa_tea = document.getElementById("raisa_tea");
  const raisa_tea3 = document.getElementById("raisa_tea3");
  const reshika_br = document.getElementById("reshika_br");
  const reshika_peace = document.getElementById("reshika_peace");
  const reshika_tea = document.getElementById("reshika_tea");
  const sushi_half_ready = document.getElementById("sushi_half_ready");
  const sushi_ready = document.getElementById("sushi_ready");
  const sushi_unready = document.getElementById("sushi_unready");
  const sushi = document.getElementById("sushi");
  const tabling1 = document.getElementById("tabling1");
  const tabling2 = document.getElementById("tabling2");
  const tabling3 = document.getElementById("tabling3");
  const times = document.getElementById("times");
  const tonia_tea = document.getElementById("tonia_tea");
  const vianna_tea = document.getElementById("vianna_tea");

  photos = document.querySelectorAll("img");

  setTimeout(() => {
    photos.forEach((el) => {
      el.style.display = "block";
    });
  }, 1000);

  setEndPositions();
});

window.addEventListener("resize", () => {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  setEndPositions();
});

window.addEventListener("scroll", () => {
  if (!observer) {
    initializeObserver();
  }
});

function initializeObserver() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  });

  photos.forEach((el) => {
    observer.observe(el);
  });
}

function setEndPositions() {
  const sh = 300;
  var sl = windowWidth / 2 - 850;

  setPos(analog_together, sl + 430, sh + 0);
  setPos(andrew, sl + 730, sh + 0);
  setPos(cos_dinner, sl + 300, sh + 500);
  setPos(funny, sl + 730, sh + 420);
  setPos(funny0, sl + 1050, sh + 420);
  setPos(ethan, sl + 1050, sh + 640);
  setPos(nethra_tea, sl + 330, sh + 850);
  setPos(nethra_br, sl + 730, sh + 960);
  setPos(sushi_unready, sl + 1050, sh + 1160);
  setPos(reshika_peace, sl + 410, sh + 1365);
  setPos(noah_tea1, sl + 1050, sh + 1575);
  setPos(raisa_tea_smile, sl + 210, sh + 1850);
  setPos(raisa_tea, sl + 630, sh + 1850);
  setPos(sushi_half_ready, sl + 1050, sh + 2010);
  setPos(times, sl + 355, sh + 2390);
  setPos(tabling1, sl + 800, sh + 2390);
  setPos(tabling2, sl + 250, sh + 2730);
  setPos(tonia_tea, sl + 800, sh + 2810);
  setPos(vianna_tea, sl + 1200, sh + 2810);
  setPos(sushi_ready, sl + 250, sh + 3155);
  setPos(reshika_tea, sl + 800, sh + 3330);
  setPos(reshika_br, sl + 390, sh + 3500);
}

function setPos(img, x, y) {
  img.style.display = "block";
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
}
