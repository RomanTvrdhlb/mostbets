//-----vars---------------------------------------
const header = document.querySelector("header");
const overlay = document.querySelector("[data-overlay]");
const mobileMenu = document.querySelector(".h2o-mobile-menu");
const burgers = document.querySelectorAll(".h2o-burger");
const mainSlider = document.querySelector(".h2o-main-slider");
const accParrent = [...document.querySelectorAll("[data-accordion-init]")];
const htmlEl = document.documentElement;
const bodyEl = document.body;
const stockSlider = document.querySelector('.h2o-stock-slider');
const bonusSliderElement = document.querySelector('.h2o-bonus-slider');
const slides = document.querySelectorAll('.h2o-bonus-slider__slide');
const asideMenu = document.querySelector('.h2o-sidebar');
const asideMenuBtn = document.querySelector('.h2o-aside-button');
const searchForms = document.querySelectorAll('.h2o-search-form');

//------------------------------------------------

//----customFunction------------------------------
const toggleCustomClass = (item, customClass = "active") => {
  item.classList.toggle(customClass);
};

const toggleClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.toggle(customClass);
  });
};

const removeClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.remove(customClass);
  });
};

const addCustomClass = (item, customClass = "active") => {
  item.classList.add(customClass);
};

const removeCustomClass = (item, customClass = "active") => {
  item.classList.remove(customClass);
};

const disableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const pagePosition = window.scrollY;
  const paddingOffset = `${window.innerWidth - bodyEl.offsetWidth}px`;

  htmlEl.style.scrollBehavior = "none";
  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
  bodyEl.style.paddingRight = paddingOffset;
  bodyEl.classList.add("dis-scroll");
  bodyEl.dataset.position = pagePosition;
  bodyEl.style.top = `-${pagePosition}px`;
};

const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const body = document.body;
  const pagePosition = parseInt(bodyEl.dataset.position, 10);
  fixBlocks.forEach((el) => {
    el.style.paddingRight = "0px";
  });
  bodyEl.style.paddingRight = "0px";

  bodyEl.style.top = "auto";
  bodyEl.classList.remove("dis-scroll");
  window.scroll({
    top: pagePosition,
    left: 0,
  });
};

const elementHeight = (el, variableName) => {
  if(el) {
    function initListener(){
      const elementHeight = el.offsetHeight;
      document.querySelector(':root').style.setProperty(`--${variableName}`, `${elementHeight}px`);
    }
    window.addEventListener('DOMContentLoaded', initListener)
    window.addEventListener('resize', initListener)
  }
}
//------------------------------------------------

//----asideMenuHandler----------------------------
asideMenu && asideMenuBtn &&
  asideMenuBtn.addEventListener("click", function (e) {
    e.preventDefault();
    addCustomClass(asideMenu, 'active');
  });

//----asideMenuClose-----------------------------
asideMenu && asideMenuBtn &&
  document.addEventListener("click", function (event) {
    if (!asideMenu.contains(event.target) && !asideMenuBtn.contains(event.target)) {
      removeCustomClass(asideMenu, 'active');
    }
  });
 
//----accordion----------------------------------
window.addEventListener("DOMContentLoaded", () => {
  accParrent &&
    accParrent.map(function (accordionParrent) {
      if (accordionParrent) {
        let multipleSetting = false;
        let breakpoinSetting = false;
        let defaultOpenSetting;

        if (
          accordionParrent.dataset.single &&
          accordionParrent.dataset.breakpoint
        ) {
          multipleSetting = accordionParrent.dataset.single; // true - включает сингл аккордион
          breakpoinSetting = accordionParrent.dataset.breakpoint; // брейкпоинт сингл режима (если он true)
        }

        const getAccordions = function (dataName = "[data-id]") {
          return accordionParrent.querySelectorAll(dataName);
        };

        const accordions = getAccordions();
        let openedAccordion = null;

        const closeAccordion = function (accordion, className = "active") {
          accordion.style.maxHeight = 0;
          removeCustomClass(accordion, className);
        };

        const openAccordion = function (accordion, className = "active") {
          accordion.style.maxHeight = accordion.scrollHeight + "px";
          addCustomClass(accordion, className);
        };

        const toggleAccordionButton = function (button, className = "active") {
          toggleCustomClass(button, className);
        };

        const checkIsAccordionOpen = function (accordion) {
          return accordion.classList.contains("active");
        };

        const accordionClickHandler = function (e) {
          e.preventDefault();
          let curentDataNumber = this.dataset.id;

          toggleAccordionButton(this);
          const accordionContent = accordionParrent.querySelector(
            `[data-content="${curentDataNumber}"]`
          );
          const isAccordionOpen = checkIsAccordionOpen(accordionContent);

          if (isAccordionOpen) {
            closeAccordion(accordionContent);
            openedAccordion = null;
          } else {
            if (openedAccordion != null) {
              const mobileSettings = () => {
                let containerWidth = document.documentElement.clientWidth;
                if (
                  containerWidth <= breakpoinSetting &&
                  multipleSetting === "true"
                ) {
                  closeAccordion(openedAccordion);
                  toggleAccordionButton(
                    accordionParrent.querySelector(
                      `[data-id="${openedAccordion.dataset.content}"]`
                    )
                  );
                }
              };

              window.addEventListener("resize", () => {
                mobileSettings();
              });
              mobileSettings();
            }

            openAccordion(accordionContent);
            openedAccordion = accordionContent;
          }
        };

        const activateAccordion = function (accordions, handler) {
          for (const accordion of accordions) {
            accordion.addEventListener("click", handler);
          }
        };
        const accordionDefaultOpen = (currentId) => {
          const defaultOpenContent = accordionParrent.querySelector(
            `[data-content="${currentId}"]`
          );
          const defaultOpenButton = accordionParrent.querySelector(
            `[data-id="${currentId}"]`
          );
          openedAccordion = defaultOpenContent;

          toggleAccordionButton(defaultOpenButton);
          openAccordion(defaultOpenContent);
        };

        if (accordionParrent.dataset.default) {
          defaultOpenSetting = accordionParrent.dataset.default; // получает id аккордиона который будет открыт по умолчанию
          accordionDefaultOpen(defaultOpenSetting);
        }

        activateAccordion(accordions, accordionClickHandler);
      }
    });
});

//----burger------------------------------------
const mobileMenuHandler = function (overlay, mobileMenu, burgers) {
  burgers.forEach((burger) => {
    burger.addEventListener("click", function (e) {
      e.preventDefault();
      toggleCustomClass(header, "active");
      toggleCustomClass(mobileMenu);
      toggleClassInArray(burgers);
      toggleCustomClass(overlay);
      burger.classList.contains("active") ? disableScroll() : enableScroll();
    });
  });
};

const hideMenuHandler = function (overlay, mobileMenu, burgers) {
  removeCustomClass(mobileMenu);
  removeClassInArray(burgers);
  removeCustomClass(header, "active");
  removeCustomClass(overlay);
  enableScroll();
};

if (overlay) {
  mobileMenuHandler(overlay, mobileMenu, burgers);
  overlay.addEventListener("click", function (e) {
    e.target.classList.contains("h2o-overlay")
      ? hideMenuHandler(overlay, mobileMenu, burgers)
      : null;
  });
}

//----sliders------------------------------------

mainSlider &&
  new Splide(mainSlider, {
    type: "loop",
    perPage: 1,
    gap: 14,
  }).mount();


  stockSlider && new Splide( stockSlider, {
    type   : 'slide',
    perPage: 3,
    speed:1200,
    gap: 20,
    pagination:false,
    mediaQuery: 'min',
    breakpoints: {
      280: {
        perPage: '1',
        gap: 14,
      },
      576: {
        perPage: 2,
      },
      1024: {
        perPage: 2,
        gap: 20,
      },
      1440: {
        arrows:false,
        drag:false,
        perPage: 3,
      },
    }
  } ).mount();

  if(bonusSliderElement){
  const bonusSlider = new Splide(bonusSliderElement, {
      type   : 'slide',
      perPage: 1,
      autoplay: true,
      interval: 3500,
      fixedWidth: 'clamp(540px, 35.417vw, 680px)',
      updateOnMove: true,
      speed: 1250,
      click: true,
      pagination: false,
      arrows: false,
      drag: false,
      mediaQuery: 'max',
      breakpoints: {
        1240: {
          perPage: '1',
          gap: 10,
          fixedWidth: '100%',
          drag: true,
        }
      }
  }).mount();

  bonusSlider.on('moved', function (newIndex) {
    const totalSlides = bonusSlider.length;
    const rewindThreshold = 3;

    if (newIndex === totalSlides - rewindThreshold) {
        bonusSlider.go(0);
    }
});

bonusSliderElement && slides.forEach((slide, index) => {
  slide.style.zIndex = slides.length - index;
  slide.addEventListener('click', () => {
    bonusSlider.go(index >= slides.length - 3 ? 0 : index);
});
});
}




//----stickyHeader------------------------------
let lastScroll = 0;
const defaultOffset = 40;

function stickyHeaderFunction(breakpoint){
  let containerWidth = document.documentElement.clientWidth;
  if (containerWidth > `${breakpoint}`) {
    const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
    const containHide = () => header.classList.contains('sticky');

    window.addEventListener('scroll', () => {
        if(scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
            addCustomClass(header, "sticky")
        }
        else if(scrollPosition() < defaultOffset){
            removeCustomClass(header, "sticky")
        }

        lastScroll = scrollPosition();
    })
  }
}

stickyHeaderFunction(320);
elementHeight(header, "header-height");

//------search----------------------------------
searchForms && searchForms.forEach(function(form){
  const input = form.querySelector('input');
  const value = input.value;
  const clearBtn = form.querySelector('.h2o-search-form__clear');


  clearBtn.addEventListener('click', function (e) {
    e.preventDefault();
    input.value = '';
    removeCustomClass(clearBtn, 'active');
  });

  input.addEventListener('blur', function () {
    removeCustomClass(clearBtn, 'active');
  });

  input.addEventListener('input', function () {
    updateButtonClass();
  });

  function updateButtonClass() {  
    if (value.trim() !== '') {
      removeCustomClass(clearBtn, 'active')
    } else {
      addCustomClass(clearBtn, 'active');
    }
  }
})
