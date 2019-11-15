const root = document.getElementById("root");
if (!root) throw new Error("Can't find root element");

const linkContainer = document.getElementById("link-container");
if (!linkContainer) throw new Error("Can't find button container");

window.addEventListener("scroll", () => {
  window.localStorage.setItem("scrollPos", window.scrollY.toString());
});

window.addEventListener("load", () => {
  window.scrollTo({
    top: parseInt(window.localStorage.getItem("scrollPos") || "0", 10)
  });
});
