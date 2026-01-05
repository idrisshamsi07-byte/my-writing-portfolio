// Dean Attali / Beautiful Jekyll 2023

let BeautifulJekyllJS = {

  bigImgEl : null,
  numImgs : null,

  init : function() {
    setTimeout(BeautifulJekyllJS.initNavbar, 10);

    // Shorten the navbar after scrolling a little bit down
    $(window).scroll(function() {
        if ($(".navbar").offset().top > 50) {
            $(".navbar").addClass("top-nav-short");
        } else {
            $(".navbar").removeClass("top-nav-short");
        }
    });

    // On mobile, hide the avatar when expanding the navbar menu
    $('#main-navbar').on('show.bs.collapse', function () {
      $(".navbar").addClass("top-nav-expanded");
    });
    $('#main-navbar').on('hidden.bs.collapse', function () {
      $(".navbar").removeClass("top-nav-expanded");
    });

    // show the big header image
    BeautifulJekyllJS.initImgs();

    BeautifulJekyllJS.initSearch();
  },

  initNavbar : function() {
    // Set the navbar-dark/light class based on its background color
    const rgb = $('.navbar').css("background-color").replace(/[^\d,]/g,'').split(",");
    const brightness = Math.round(( // http://www.w3.org/TR/AERT#color-contrast
      parseInt(rgb[0]) * 299 +
      parseInt(rgb[1]) * 587 +
      parseInt(rgb[2]) * 114
    ) / 1000);
    if (brightness <= 125) {
      $(".navbar").removeClass("navbar-light").addClass("navbar-dark");
    } else {
      $(".navbar").removeClass("navbar-dark").addClass("navbar-light");
    }
  },

  initImgs : function() {
    // If the page was large images to randomly select from, choose an image
    if ($("#header-big-imgs").length > 0) {
      BeautifulJekyllJS.bigImgEl = $("#header-big-imgs");
      BeautifulJekyllJS.numImgs = BeautifulJekyllJS.bigImgEl.attr("data-num-img");

      // 2fc73a3a967e97599c9763d05e564189
      // set an initial image
      const imgInfo = BeautifulJekyllJS.getImgInfo();
      const src = imgInfo.src;
      const desc = imgInfo.desc;
      BeautifulJekyllJS.setImg(src, desc);

      // For better UX, prefetch the next image so that it will already be loaded when we want to show it
      const getNextImg = function() {
        const imgInfo = BeautifulJekyllJS.getImgInfo();
        const src = imgInfo.src;
        const desc = imgInfo.desc;

        const prefetchImg = new Image();
        prefetchImg.src = src;
        // if I want to do something once the image is ready: `prefetchImg.onload = function(){}`

        setTimeout(function(){
          const img = $("<div></div>").addClass("big-img-transition").css("background-image", 'url(' + src + ')');
          $(".intro-header.big-img").prepend(img);
          setTimeout(function(){ img.css("opacity", "1"); }, 50);

          // after the animation of fading in the new image is done, prefetch the next one
          //img.one("transitioned webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
          setTimeout(function() {
            BeautifulJekyllJS.setImg(src, desc);
            img.remove();
            getNextImg();
          }, 1000);
          //});
        }, 6000);
      };

      // If there are multiple images, cycle through them
      if (BeautifulJekyllJS.numImgs > 1) {
        getNextImg();
      }
    }
  },

  getImgInfo : function() {
    const randNum = Math.floor((Math.random() * BeautifulJekyllJS.numImgs) + 1);
    const src = BeautifulJekyllJS.bigImgEl.attr("data-img-src-" + randNum);
    const desc = BeautifulJekyllJS.bigImgEl.attr("data-img-desc-" + randNum);

    return {
      src : src,
      desc : desc
    }
  },

  setImg : function(src, desc) {
    $(".intro-header.big-img").css("background-image", 'url(' + src + ')');
    if (typeof desc !== typeof undefined && desc !== false) {
      $(".img-desc").text(desc).show();
    } else {
      $(".img-desc").hide();
    }
  },

  initSearch : function() {
    if (!document.getElementById("beautifuljekyll-search-overlay")) {
      return;
    }

    $("#nav-search-link").click(function(e) {
      e.preventDefault();
      $("#beautifuljekyll-search-overlay").show();
      $("#nav-search-input").focus().select();
      $("body").addClass("overflow-hidden");
    });
    $("#nav-search-exit").click(function(e) {
      e.preventDefault();
      $("#beautifuljekyll-search-overlay").hide();
      $("body").removeClass("overflow-hidden");
    });
    $(document).on('keyup', function(e) {
      if (e.key == "Escape") {
        $("#beautifuljekyll-search-overlay").hide();
        $("body").removeClass("overflow-hidden");
      }
    });
  }
};

// 2fc73a3a967e97599c9763d05e564189

document.addEventListener('DOMContentLoaded', BeautifulJekyllJS.init);

document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".carousel-track");
  const leftBtn = document.querySelector(".left-btn");
  const rightBtn = document.querySelector(".right-btn");
  const cards = document.querySelectorAll(".carousel-card");
  
  if (!track || !leftBtn || !rightBtn || cards.length === 0) return;
  
  let currentIndex = 0;
  let autoScrollInterval;
  
  function updateCarousel() {
    // Calculate the offset to center the current card
    const cardWidth = cards[0].offsetWidth;
    const gap = 30;
    // Start from center (50%) then offset by half card width to truly center it
    const offset = (currentIndex * (cardWidth + gap)) + (cardWidth / 2);
    
    track.style.transform = `translateX(-${offset}px)`;
    
    // Update active card styling
    cards.forEach((card, index) => {
      if (index === currentIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
    
    // Update button states
    leftBtn.disabled = currentIndex === 0;
    rightBtn.disabled = currentIndex === cards.length - 1;
  }
  
  function scrollLeft() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      restartAutoScroll();
    }
  }
  
  function scrollRight() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateCarousel();
      restartAutoScroll();
    }
  }
  
  function autoScroll() {
    if (currentIndex >= cards.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updateCarousel();
  }
  
  function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(autoScroll, 5000);
  }
  
  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }
  
  function restartAutoScroll() {
    stopAutoScroll();
    startAutoScroll();
  }
  
  // Button click handlers
  leftBtn.addEventListener("click", scrollLeft);
  rightBtn.addEventListener("click", scrollRight);
  
  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      scrollLeft();
    } else if (e.key === "ArrowRight") {
      scrollRight();
    }
  });
  
  // Pause auto-scroll on hover
  [leftBtn, rightBtn, track].forEach(el => {
    el.addEventListener("mouseenter", stopAutoScroll);
    el.addEventListener("mouseleave", startAutoScroll);
  });
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel();
    }, 250);
  });
  
  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoScroll();
  });
  
  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoScroll();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      scrollRight();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      scrollLeft();
    }
  }
  
  // Initialize
  updateCarousel();
  startAutoScroll();
});
