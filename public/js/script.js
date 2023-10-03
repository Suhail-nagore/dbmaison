(() => {
  const openNavMenu = document.querySelector(".open-nav-menu");
  const closeNavMenu = document.querySelector(".close-nav-menu");

  const navMenu = document.querySelector(".nav-menu");

  const menuOverlay = document.querySelector(".menu-overlay");

  const mediaSize = 1070;

  openNavMenu.addEventListener("click", togglenav);
  closeNavMenu.addEventListener("click", togglenav);

  // close the navmenu by clicking outside
  menuOverlay.addEventListener("click", togglenav);

  function togglenav() {
    navMenu.classList.toggle("open");
    menuOverlay.classList.toggle("active");
    document.body.classList.toggle(".hidden-scrolling");
  }

  navMenu.addEventListener("click", (event) => {
    if (
      event.target.hasAttribute("data-toggle") &&
      window.innerWidth <= mediaSize
    ) {
      const menuItemHasChildren = event.target.parentElement;

      //if menuhaschildren is already expanded collaps it

      if (menuItemHasChildren.classList.contains("active")) {
        collapseSubMenu();
      } else {
        // //// ==============collapse existing expanded menuItemHasChildren

        if (navMenu.querySelector(".menu-item-has-children.active")) {
          collapseSubMenu();
        }
        //============== expand new menuItemHasChildren
        menuItemHasChildren.classList.add("active");
        const subMenu = menuItemHasChildren.querySelector(".sub-menu");
        subMenu.style.maxHeight = subMenu.scrollHeight + "px";
      }
    }
  });

  function collapseSubMenu() {
    navMenu
      .querySelector(".menu-item-has-children.active  .sub-menu")
      .removeAttribute("style");
    navMenu
      .querySelector(".menu-item-has-children.active")
      .classList.remove("active");
  }

  function resizeFix() {
    // if navMenu is open then clas it
    if (navMenu.classList.contains("open")) {
      togglenav();
    }
    // if menu-menuItemHasChildren is expanded then collaps it
    if (navMenu.querySelector(".menu-item-has-children.active")) {
      collapseSubMenu();
    }
  }

  window.addEventListener("resize", function () {
    if (this.innerWidth > mediaSize) {
      resizeFix();
    }
  });
})();
