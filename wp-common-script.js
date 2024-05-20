(function ($) {
  $(document).ready(function () {
    //   $('#phone-nav').click(function(){
    //     $('body').toggleClass('nav-expand');
    //     $('body').toggleClass('navexpand');
    //     $(this).toggleClass('active');
    // });

    if ($("#checkout-page").length > 0) {
      $("body").addClass("checkout-page");
    }

    if ($(".add-ons-page").length > 0) {
      $("body").addClass("add-ons");
    }

    var header = new Headroom(document.querySelector("header"), {
      tolerance: 80, // Corrected the property name
      offset: 55,
      classes: {
        initial: "headroom",
        pinned: "slidedown",
        unpinned: "slideup",
        top: "headroom--top",
        notTop: "headroom--not-top",
        bottom: "headroom--bottom",
        notBottom: "headroom--not-bottom",
        frozen: "headroom--frozen",
      },
    });
    header.init();

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    if ($(".split-heading").length) {
      let splitWords = function (selector) {
        var elements = document.querySelectorAll(selector);

        elements.forEach(function (el) {
          el.dataset.splitText = el.textContent;
          el.innerHTML = el.textContent
            .split(/\s/)
            .map(function (word) {
              return word
                .split("-")
                .map(function (word) {
                  return '<dfn class="word">' + word + "</dfn>";
                })
                .join('<dfn class="hyphen">-</dfn>');
            })
            .join('<dfn class="whitespace"> </dfn>');
        });
      };

      let splitLines = function (selector) {
        var elements = document.querySelectorAll(selector);

        splitWords(selector);

        elements.forEach(function (el) {
          var lines = getLines(el);

          var wrappedLines = "";
          lines.forEach(function (wordsArr) {
            wrappedLines += '<dfn class="line"><dfn class="words">';
            wordsArr.forEach(function (word) {
              wrappedLines += word.outerHTML;
            });
            wrappedLines += "</dfn></dfn>";
          });
          el.innerHTML = wrappedLines;
        });
      };

      let getLines = function (el) {
        var lines = [];
        var line;
        var words = el.querySelectorAll("dfn");
        var lastTop;
        for (var i = 0; i < words.length; i++) {
          var word = words[i];
          if (word.offsetTop != lastTop) {
            // Don't start with whitespace
            if (!word.classList.contains("whitespace")) {
              lastTop = word.offsetTop;

              line = [];
              lines.push(line);
            }
          }
          line.push(word);
        }
        return lines;
      };

      splitLines(".split-heading");

      let revealText = document.querySelectorAll(".split-heading");

      $(".split-heading").each(function () {
        var $this = $(this);
        $this.find(".words").each(function (i) {
          $(this).css(
            "transition",
            "1.2s cubic-bezier(0.19,1,0.22,1) transform"
          );
          $(this).css("transition-delay", 0 + i * 0.2 + "s");
        });
      });

      var $animation_elements = $(".split-heading");
      var $window = $(window);

      function check_if_in_view() {
        var window_height = $window.height() / 1.1;
        var insetAmount = window_height / 10; // fifth of the screen
        var window_top_position = $window.scrollTop();
        var window_bottom_position =
          window_top_position + window_height - insetAmount;

        $.each($animation_elements, function () {
          var $element = $(this);
          var element_height = $element.outerHeight();
          var element_top_position = $element.offset().top;
          var element_bottom_position = element_top_position + element_height;

          //check to see if this current container is within viewport
          if (element_top_position <= window_bottom_position) {
            $element.addClass("is-visible");
          }
        });
      }
      $window.on("scroll orientationchange resize", check_if_in_view);
      $window.trigger("scroll");

      var $animation_elements1 = $(".fadeIn-from-bottom");
      function check_if_in_view1() {
        var window_height1 = $window.height() / 1.15;
        var insetAmount1 = window_height1 / 10; // fifth of the screen
        var window_top_position1 = $window.scrollTop();
        var window_bottom_position1 =
          window_top_position1 + window_height1 - insetAmount1;

        $.each($animation_elements1, function () {
          var $element1 = $(this);
          var element_height1 = $element1.outerHeight();
          var element_top_position1 = $element1.offset().top;
          var element_bottom_position1 =
            element_top_position1 + element_height1;

          //check to see if this current container is within viewport
          if (element_top_position1 <= window_bottom_position1) {
            $element1.addClass("is-visible");
          }
        });
      }
      $window.on("scroll orientationchange resize", check_if_in_view1);
      $window.trigger("scroll");
    }

    const backToTop = $("#backToTop");
    const amountScrolled = 300;

    $(window).scroll(() => {
      $(window).scrollTop() >= amountScrolled
        ? backToTop.fadeIn("fast")
        : backToTop.fadeOut("fast");
    });

    backToTop.click(() => {
      $("body, html").animate(
        {
          scrollTop: 0,
        },
        600
      );
      return false;
    });

    // faq page

    $(".accordion-item").each(function () {
      var $this = $(this);
      $this.find(" > h5").on("click touch", function () {
        $(".accordion-item").removeClass("active");
        $(".accordion-item .accordion-content").slideUp();
        if ($this.find(".accordion-content:visible").length) {
          $(".accordion-item").removeClass("active");
          $(".accordion-item.accordion-content").slideUp();
        } else {
          $this.addClass("active");
          $(".accordion-item .accordion-content").slideUp();
          $this.find(" > .accordion-content").slideDown();
        }
      });
    });

    // faq page

    //Review Section Slider
    if ($(".slider-item").length) {
      $(".slider-item").slick({
        arrows: false,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 1500,
        speed: 700,
        navigation: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        centerMode: false,
        focusOnSelect: true,
      });
    }

    $("#showAllImagesBtn").on("click", function () {
      $("body").addClass("modalshow").css("overflow", "hidden");
    });

    $(".close-modal, .image-modal").on("click", function () {
      $("body").removeClass("modalshow").css("overflow-y", "auto");
    });

    $(".close-btn").on("click", function (event) {
      event.stopPropagation(); // Prevent the modal from closing when close button is clicked
    });

    $("#amenities").on("click", function () {
      $("body").addClass("modalShow");
    });

    $(".close-modal, .benefits-modal").on("click", function () {
      $("body").removeClass("modalShow");
    });

    $(".close-btn").on("click", function (event) {
      event.stopPropagation(); // Prevent the modal from closing when close button is clicked
    });

    $("#camp-btn").on("click", function () {
      $("body").addClass("camModal");
    });

    $(".close-modal, .camp-modal").on("click", function () {
      $("body").removeClass("camModal");
    });

    $(".close-btn").on("click", function (event) {
      event.stopPropagation(); // Prevent the modal from closing when close button is clicked
    });

    $("#safety-btn").on("click", function () {
      $("body").addClass("openModal");
    });

    $(".close-modal, .safety-modal").on("click", function () {
      $("body").removeClass("openModal");
    });

    $(".close-btn").on("click", function (event) {
      event.stopPropagation(); // Prevent the modal from closing when close button is clicked
    });

    $("#reserv").on("click", function () {
      jQuery("#single-basecamp-mobile-calendar").removeClass("hidden");
    });

    $("#single-basecamp-mobile-calendar .close-modal").on("click", function () {
      jQuery("#single-basecamp-mobile-calendar").addClass("hidden");
    });

    $(".close-modal, .safety-modal").on("click", function () {
      $("body").removeClass("openCalender");
    });

    $(".close-btn").on("click", function (event) {
      event.stopPropagation(); // Prevent the modal from closing when close button is clicked
    });

    // open calendar popup
    $("#mobi-date-select").on("click", function () {
      $("body").addClass("modal-one").css("overflow", "hidden");
      $(".main-header-section").addClass("hidden");
    });

    // function to close mobile popup modal
    // $(".close-modal, .hero-popup").on("click", function () {
    //   $("body").removeClass("modal-one");
    // });

    $(".close-modal").on("click", function (event) {
      $("body").removeClass("modal-one").css("overflow-y", "auto");
      $(".main-header-section").removeClass("hidden");
    });

    // cancelation policy modal script
    $("#cancelation-policy-modal-activator").on("click", function (event) {
      $(".cancelation-policy-modal").removeClass("hidden");
    });

    $("#cancelation-policy-modal-disabler").on("click", function (event) {
      $(".cancelation-policy-modal").addClass("hidden");
      $("#cancelation-policy-error").addClass("hidden");
    });

    // toggle mobile calendar dates modal
    let mobileCalendarOpen;
    $(".calendar-dates-toggler").on("click", function (e) {
      e.stopPropagation();
      if (mobileCalendarOpen) {
        $(".mobile-calendar-body").addClass("hidden");
        $("#mobile-adults-row").css("display", "flex");
        mobileCalendarOpen = false;
      } else {
        mobileCalendarOpen = true;
        $(".mobile-calendar-body").removeClass("hidden");
        $("#mobile-adults-row").css("display", "none");
      }
    });

    $(".close-modal, .hero-popup2").on("click", function () {
      $("body").removeClass("modal-two");
    });

    // $(".close-modal").on("click", function (event) {
    //   event.stopPropagation(); // Prevent the modal from closing when close button is clicked
    // });

    // $(".date-pick-adults").on("click", function () {
    //   $("body").addClass("modal-three");
    // });

    // $(".close-modal, .adult-wrap").on("click", function () {
    //   $("body").removeClass("modal-three");
    // });

    // $(".close-modal").on("click", function (event) {
    //   event.stopPropagation(); // Prevent the modal from closing when close button is clicked
    // });

    const phoneInput = document.querySelector("#phoneInput");

    // Initialize intlTelInput
    // const iti = window.intlTelInput(phoneInput, {
    //   utilsScript:
    //     "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.12/js/utils.min.js",
    // });

    // Set initial country based on the user's location
    // iti.promise.then(() => {
    //   const countryCode = iti.getSelectedCountryData().iso2;
    //   iti.setCountry(countryCode);
    // });

    // Listen for the country change event
    // phoneInput.addEventListener("countrychange", function () {
    //   const countryCode = iti.getSelectedCountryData().iso2;
    //   console.log("Selected country code:", countryCode);
    // });
  }); // End ready function.
})(jQuery);

/* ===========
          global variable to fetch data
                              ==============*/
const homeUrl = window.location.origin;

var mac = 0;
if (navigator.userAgent.indexOf("Mac") > 0) {
  mac = 1;
} else {
  mac = 0;
}
if (1 == mac) {
  jQuery("body").addClass("mac-os");
} else {
  jQuery("body").addClass("win-os");
}

// loading svg to show loading
const loadingSVG = `
  <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512">
        <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/>
      </svg>
  `;

// Function to get the number of days in a month
function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

async function generateCalendar(month, year, isSinglePage = false) {
  const daysInSelectedMonth = daysInMonth(month, year);
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // Note: Sunday is 0, Monday is 1, etc.

  let bookingDates = null;
  // console.log("before request");
  if (isSinglePage) {
    bookingDates = await getBookingDates(month, year);
  }

  let calendarHTML = "<table>";
  calendarHTML +=
    "<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>";

  let day = 1;
  let calendarRow = 6;
  for (let i = 0; i < calendarRow; i++) {
    // break the loop if it fits in 5 row
    if (i === 5 && day > daysInSelectedMonth) {
      break;
    }

    calendarHTML += "<tr>";
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfMonth) {
        calendarHTML += "<td class='disabled'><span>0</span></td>";
      } else if (day > daysInSelectedMonth) {
        calendarHTML += "<td class='disabled'><span>0</span></td>";
      } else {
        const td = await getDisabledOrSelectableDateTD(
          month,
          year,
          day,
          bookingDates
        );
        calendarHTML += td;
        // increase the day;
        day++;
      }
    }
    calendarHTML += "</tr>";
  }

  calendarHTML += "</table>";
  return calendarHTML;
}

async function getDisabledOrSelectableDateTD(month, year, day, bookingDates) {
  // TODO: have to fix this date problem.
  let disablePrevDay = isCurrentMonth(month, year);
  const currentDate = new Date(year, month, day + 1);
  const currentDateStr = currentDate.toISOString().split("T")[0];

  // TODO: have to remove the static today date;
  let today = new Date().getDate();

  // check if the day is previous day or not.
  if (disablePrevDay && day < today) {
    return `<td class='day disabled ${currentDateStr}' data-date="${currentDateStr}"><span>${day}</span></td>`;
  } else {
    /* check if the current date is in booking date if it exist,
      then check if its available or not */
    if (
      bookingDates &&
      currentDateStr in bookingDates &&
      !bookingDates[currentDateStr]
    ) {
      return `<td class='day disabled ${currentDateStr}' data-date="${currentDateStr}"><span>${day}</span></td>`;
    }
    return `<td class='day selectable ${currentDateStr}' onclick="handleDatePicker(event)" data-date="${currentDateStr}"><span>${day}</span></td>`;
  }
}

// date fetching all global variables
const basecampId = getBaseCampIdFromUrl();

let cachedBookingDates = {};
let isInitialFetch = true;
let isAllDatesFechedInBackground = false;
let currentMonthPos;

function getBaseCampIdFromUrl() {
  const basecampIdHolderEl = document.getElementById("basecamp-id-holder");
  if (basecampIdHolderEl) {
    const id = basecampIdHolderEl.getAttribute("data-basecamp-id");
    return id;
  }
}

// get booking dates
async function getBookingDates(month, year) {
  month;
  // Check if data for the requested month is already cached
  if (!isInitialFetch || isAllDatesFechedInBackground) {
    const cachedData = getCachedData(month, year);
    if (Object.keys(cachedData).length) {
      return cachedData;
    }
  }
  // If it's the initial fetch, start fetching all dates for the basecampId in the background
  if (isInitialFetch || !isAllDatesFechedInBackground) {
    fetchAllDatesInBackground();
    isInitialFetch = false;
  }

  let bookingDatesObj = {};

  try {
    month++;
    const response = await fetch(
      `${homeUrl}/wp-json/hostway/v1/listings/${basecampId}/calendar?month=${month}&year=${year}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { result } = data?.data;
    if (result.length > 0) {
      result.forEach((item) => {
        const day = new Date(item.date).getDate();
        bookingDatesObj[item.date] = item.isAvailable;
      });
    }
  } catch (error) {
    console.error(error);
  }
  return bookingDatesObj;
}

// Function to fetch all dates for the basecampId in the background
function fetchAllDatesInBackground() {
  return new Promise((resolve, reject) => {
    fetch(`${homeUrl}/wp-json/hostway/v1/listings/${basecampId}/all-dates`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status !== 200) {
          throw new Error(`Internal server error. Data not found`);
        }
        const { result } = data?.data;
        cachedBookingDates = result;
        reorderAndSaveCachedDates(result);
        resolve(result);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

function reorderAndSaveCachedDates(data) {
  const promises = data.map((item) => {
    return new Promise((resolve, reject) => {
      // Change the object value according to need.
      cachedBookingDates[item.date] = item.isAvailable;
      resolve();
    });
  });

  Promise.all(promises)
    .then(() => {
      // Set isAllDatesFechedInBackground true after all promises are resolved (loop is finished).
      isAllDatesFechedInBackground = true;
    })
    .catch((error) => {
      console.error("Error occurred while processing data:", error);
    });
}

// Function to retrieve cached data for the specified month and year
function getCachedData(month, year) {
  let bookingDatesObj = {};
  // Get the total number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const key = new Date(year, month, day + 1).toISOString().split("T")[0];
    bookingDatesObj[key] = cachedBookingDates[key];
  }
  return bookingDatesObj;
}

function getMonthName(monthIndex) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex];
}

// function to update previous month of homepage
async function homePrevMonth() {
  const currentMonthElement = document.querySelector(".home-date-calendar");
  const currentViewedYear = parseInt(currentMonthElement.dataset.year);
  let currentViewedMonth = parseInt(currentMonthElement.dataset.month);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  if (
    currentYear === currentViewedYear &&
    currentViewedMonth === currentMonth
  ) {
    return;
  }

  const prevDates = await getPrevMonthAndYear(
    currentViewedMonth,
    currentViewedYear
  );

  await updateHomePageCalendar(prevDates.month, prevDates.year);
}

// function to update previous month of homepage
async function homeNextMonth() {
  const currentMonthElement = document.querySelector(".home-date-calendar");
  let currentYear = parseInt(currentMonthElement.dataset.year);
  let currentMonth = parseInt(currentMonthElement.dataset.month);

  const nextDates = await getNextMonthAndYear(currentMonth, currentYear);

  await updateHomePageCalendar(nextDates.month, nextDates.year);
}

// function to update previous month of single product page
async function singlePagePrevMonth() {
  const currentMonthElement = document.querySelector(
    ".single-page-date-calendar"
  );
  const currentViewedYear = parseInt(currentMonthElement.dataset.year);
  let currentViewedMonth = parseInt(currentMonthElement.dataset.month);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  if (
    currentYear === currentViewedYear &&
    currentViewedMonth === currentMonth
  ) {
    return;
  }

  const prevDates = await getPrevMonthAndYear(
    currentViewedMonth,
    currentViewedYear
  );

  await updateSinglePageCalendar(prevDates.month, prevDates.year);
}

// function to update next month of single product page
async function singlePageNextMonth() {
  const currentMonthElement = document.querySelector(
    ".single-page-date-calendar"
  );
  let currentYear = parseInt(currentMonthElement.dataset.year);
  let currentMonth = parseInt(currentMonthElement.dataset.month);

  const nextDates = await getNextMonthAndYear(currentMonth, currentYear);
  await updateSinglePageCalendar(nextDates.month, nextDates.year);
}

async function clearCalendarDates() {
  // clear first and last selected date
  setBookingDataToLocalStorage("dates", { dates: null });

  // reset first and second selected dates;
  document
    .getElementsByClassName(firstSelectedDate)[0]
    ?.classList.remove("selected", "first-selected-date");
  document
    .getElementsByClassName(secondSelectedDate)[0]
    ?.classList.remove("selected", "second-selected-date");
  firstSelectedDate = "";
  secondSelectedDate = "";

  // it will remove all active class;
  addMiddleClassToDate();
}

// single page cancelation policy script starts
function getCancelationPolicy() {
  // check if the input has dates
  const packInDate = jQuery("#cancelation-packin-input").val();
  const packOutDate = jQuery("#cancelation-packout-input").val();
  const errorEl = jQuery("#cancelation-policy-error");
  errorEl.addClass("hidden");
  // return if packin and packout date empty.
  if (!packInDate || !packOutDate) {
    errorEl.removeClass("hidden");
    return;
  }

  jQuery(".cancelation-policy-modal").addClass("hidden");
  activeAlertModal("Please wait...");
  // TODO: have to fetch this data from the api.
  // Have to calculate the time delta.

  setTimeout(() => {
    activeAlertModal(
      "100% refund up to 60 days before arrival and 50% refund up to 30 days before arrival"
    );
  }, 1000);
}

let calendarVisiable = false;
let isActiveClickDateBtn1 = false;
let isActiveClickDateBtn2 = false;
let selectedFlexibleDateType = "weekend";

// toggle calendar modal
function toggleCalendar() {
  jQuery("#dates-calendar-wrap").slideToggle();
}

// function to toggle mobile dates modal
function toggleMobileDateType(event, val) {
  if (event.target.classList.contains("active")) {
    event.target.classList.remove("active");
  } else {
    event.target.classList.add("active");
  }

  // variables
  let flexibleModal = jQuery("#mobi-flexible-Content");
  let datesModal = jQuery(".mobi-calendar-dates-container");
  let datesEl = jQuery(".mobi-dates-btn");
  let flexibleEl = jQuery(".mobi-flexible-btn");
  event.stopPropagation();

  // switch dates / flexible modal
  if (val === "dates") {
    datesEl.addClass("active");
    flexibleEl.removeClass("active");
    flexibleModal.addClass("hidden");
    datesModal.removeClass("hidden");
    setBookingDataToLocalStorage("dates", {});
  } else {
    flexibleEl.addClass("active");
    datesEl.removeClass("active");
    datesModal.addClass("hidden");
    flexibleModal.removeClass("hidden");
    setBookingDataToLocalStorage("flexible", {});
  }
}

// toggle alert container to show or hide alert
function activeAlertModal(message) {
  jQuery(".alert-message").text(message);
  jQuery(".alert-container").removeClass("hidden");
  jQuery(".alert-inner").slideDown(300);
}

function hideAlertModal() {
  jQuery(".alert-container").addClass("hidden");
  jQuery(".alert-inner").slideUp();
}

// TODO: have to fix the all date clear button.
// all date clear button toggle function
function toggleAllDateClearBtn(action, firstSelectedDate, secondSelectedDate) {
  if (action) {
    if (firstSelectedDate) {
      jQuery("#all-date-clear-btn-pack-in #all-date-clear-i").css(
        "display",
        "inline-block"
      );
    }
    if (secondSelectedDate) {
      jQuery("#all-date-clear-btn-pack-out #all-date-clear-i").css(
        "display",
        "inline-block"
      );
    }
    return;
  }
  jQuery("#all-date-clear-btn-pack-in #all-date-clear-i").css(
    "display",
    "none"
  );
  jQuery("#all-date-clear-btn-pack-out #all-date-clear-i").css(
    "display",
    "none"
  );
}

// all date clearn functionality
function clearAllDate(e) {
  e.stopPropagation();
  clearAllSelectedDate();
  toggleAllDateClearBtn();
}

// pack in button handler
jQuery("#click-to-date").on("click", toggleCalendar);

// pack out buttons handler
jQuery("#click-to-date2").on("click", function (e) {
  toggleCalendar();
});

// when button handler
jQuery("#when-flexiable-date").on("click", toggleCalendar);

/*
  info: when i am generating month and injecting them inside the .flexible-month-wrap
  container the slick slider is not working. But if i drag, scroll or click to next arrow
  its working fine. So i made initializedFlexibleSlickSlider variable  to solve the problem. 
  If you found other better solution you are welcome to try. Fell free to customize. :) Happy coading.
  */

// global variable for flexible date functinality;
let initializedFlexibleSlickSlider = false;
const selectedFlexibleMonth = {};

// weekend or week;
let activeFlexibleDateTypes = "weekend";

// show/hide flexiable dates or calendar dates functinality
function showView(view) {
  if (!initializedFlexibleSlickSlider) {
    // TODO: have to implement the smoothness.
    // slide next month el to solve the problem.
    jQuery(".flexible-month-wrap .slick-next").click();
    initializedFlexibleSlickSlider = !initializedFlexibleSlickSlider;
  }
  const datesContent = jQuery("#datesContent");
  const flexiableContent = jQuery("#flexibleContent");
  const flexibleButton = jQuery(".flexible-btn");
  const datesButton = jQuery(".dates-btn");
  const flexiableDateWhen = jQuery("#when-flexiable-date");
  const packInDate = jQuery("#click-to-date");
  const packOutDate = jQuery("#click-to-date2");
  if (view === "dates") {
    datesContent.removeClass("hidden");
    flexiableContent.addClass("hidden");
    datesButton.addClass("active");
    flexibleButton.removeClass("active");
    flexiableDateWhen.addClass("hidden");
    packInDate.removeClass("hidden");
    packOutDate.removeClass("hidden");

    // update seach filter data type
    setBookingDataToLocalStorage("dates", {});
  } else if (view === "flexible") {
    flexiableContent.removeClass("hidden");
    datesContent.addClass("hidden");
    flexibleButton.addClass("active");
    datesButton.removeClass("active");
    flexiableDateWhen.removeClass("hidden");
    packInDate.addClass("hidden");
    packOutDate.addClass("hidden");

    // update search filter data type
    setBookingDataToLocalStorage("flexible", {});
  }
}

// flexible date
function generateFlexibleMonth() {
  let flexibleMonthHtml = "";

  let currentYear = new Date().getFullYear();

  // increase the target year to generate more months.
  let currentMonth = new Date().getMonth();
  for (let i = 1; i <= 12; i++) {
    const monthName = months[currentMonth];
    /**
       * ${
        my_theme_var?.template_directory_uri
      }
       * 
       * */
    // <img src="/svgs/calendar-white.svg" alt="calendar image">
    flexibleMonthHtml += `
      <div onclick="updateSelectedFlexibleMonth(event,'${monthName}')" class="month-item">
      <figure>
      <img class="calendar-icon-white" src="${
        my_theme_var?.template_directory_uri
      }/assets/svgs/calendar-white.svg" alt="calendar image">
      <img class="calendar-icon-black" src="${
        my_theme_var?.template_directory_uri
      }/assets/svgs/flexible-month-calendar-black.svg" alt="calendar image">
    </figure>
    <h4 class="desk">${monthName} ${currentYear}</h4>
    <h4 class="mobi">${getMonthShortName(monthName)} ${currentYear}</h4>
  </div>
     `;
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
  }

  // add that html inside flexible month wrapper container
  $(".flexible-month-wrap").html(flexibleMonthHtml);
}

// flexible date type select functionality
function toggleFlexibleDateType(val) {
  const flexibleBtnWeekend = jQuery(".flexible-btn-weekend");
  const flexibleBtnWeek = jQuery(".flexible-btn-week");
  const whenDateDisplayEl = jQuery(".when-date-display");
  const flexibleDateType = jQuery(".flexible-date-type");
  if (val === "weekend") {
    // active weekend
    flexibleBtnWeekend.addClass("active");
    flexibleBtnWeek.removeClass("active");
    whenDateDisplayEl.text("Any Weekend");
    flexibleDateType.text("weekend");
    selectedFlexibleDateType = "weekend";
    activeFlexibleDateTypes = "weekend";

    setBookingDataToLocalStorage("flexible", {
      flexibleDates: {
        type: "weekend",
        selectedMonths: selectedFlexibleMonth,
      },
    });
  } else {
    // active week
    flexibleBtnWeekend.removeClass("active");
    flexibleBtnWeek.addClass("active");
    flexibleDateType.text("week");
    whenDateDisplayEl.text("Any Week");
    selectedFlexibleDateType = "week";

    activeFlexibleDateTypes = "week";

    setBookingDataToLocalStorage("flexible", {
      flexibleDates: {
        type: "week",
        selectedMonths: selectedFlexibleMonth,
      },
    });
  }

  // update when heading of calendar.
  updateWhenDisplayDate();
}

// update felexible dates when user click the month.
let monthCount = 1;
function updateSelectedFlexibleMonth(e, val) {
  if (e.currentTarget.classList?.contains("active")) {
    e.currentTarget.classList.remove("active");
  } else {
    e.currentTarget.classList.add("active");
  }

  e.preventDefault();
  e.stopPropagation();

  //  check if clicked month already exist in the list
  if (val in selectedFlexibleMonth) {
    delete selectedFlexibleMonth[val];
    monthCount--;
    e.target?.classList.remove("active");
  } else {
    selectedFlexibleMonth[val] = true;
    e.target?.classList.add("active");
    monthCount++;
  }

  // update when heading of calendar.
  updateWhenDisplayDate();
  // update to local storage.
}

function updateWhenDisplayDate() {
  const whenDateDisplayEl = jQuery(".when-date-display");
  const goAnyTimeDisplayEl = jQuery(".go-anytime-el");
  //  update "when display date" based on the month list.
  if (Object.keys(selectedFlexibleMonth).length > 0) {
    let loopTime = 1;
    const displayMonths = [];
    for (let month in selectedFlexibleMonth) {
      const monthShortName = getMonthShortName(month);
      if (loopTime <= 3) {
        displayMonths.push(monthShortName);
      } else {
        displayMonths.push(monthShortName);
        break;
      }
      loopTime++;
    }

    // add "," between each month ;
    const len = displayMonths.length;
    if (len === 4) {
      const formatedMonth = displayMonths.join(", ");
      whenDateDisplayEl.text(
        `${selectedFlexibleDateType} in ${formatedMonth} ...`
      );

      goAnyTimeDisplayEl.text(`Go in ${formatedMonth} ...`);
    } else if (len === 1) {
      whenDateDisplayEl.text(
        `${selectedFlexibleDateType} in ${displayMonths[0]}`
      );

      goAnyTimeDisplayEl.text(`Go in ${displayMonths[0]}`);
    } else {
      const formatedMonth = displayMonths.join(", ");
      whenDateDisplayEl.text(`${selectedFlexibleDateType} in ${formatedMonth}`);
      goAnyTimeDisplayEl.text(`Go in ${formatedMonth}`);
    }
  } else {
    whenDateDisplayEl.text("Any " + selectedFlexibleDateType);
    goAnyTimeDisplayEl.text("Go Anytime");
  }

  // update selected flexible month in localstorage
  setBookingDataToLocalStorage("flexible", {
    flexibleDates: {
      type: activeFlexibleDateTypes,
      selectedMonths: selectedFlexibleMonth,
    },
  });
}

function getMonthShortName(month) {
  month = month.toLowerCase();
  const shortMonthLists = {
    january: "Jan",
    february: "Feb",
    march: "Mar",
    april: "Apr",
    may: "May",
    june: "Jun",
    july: "Jul",
    august: "Aug",
    september: "Sep",
    october: "Oct",
    november: "Nov",
    december: "Dec",
  };
  const monthShortForm = shortMonthLists[month];
  return monthShortForm;
}

// Calender js global variables
let firstSelectedDate = null;
let secondSelectedDate = null;
let firstSelectedEl;
let secondSelectedEl;
let reservationCouponId = "";
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const daysContainer = document.querySelector(".days"),
  nextBtn = document.querySelector(".next-btn"),
  prevBtn = document.querySelector(".prev-btn"),
  month = document.querySelector(".month"),
  todayBtn = document.querySelector(".today-btn");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// handle cllick event on a date
function handleDatePicker(event) {
  const targetEl = event.currentTarget;
  const clickedDate = targetEl.getAttribute("data-date");
  if (!clickedDate) return;
  toggleActiveClasss(targetEl);
}

// toggle active class of a date click functionality.
async function toggleActiveClasss(el) {
  // if its home page calendar then update header packIn packOut date;
  let isHomePage;
  if ($(".home-date-calendar")?.children()?.length > 0) {
    isHomePage = true;
  }

  const clickedDate = el.getAttribute("data-date");

  // first step
  if (!firstSelectedDate) {
    firstSelectedDate = clickedDate;
    firstSelectedEl = el;
    el.classList?.add("selected");
    if (isHomePage) {
      await updatePackInPackOut("pack-in-date", new Date(clickedDate));
    }

    // save the first selected date in the local storage;
    await setBookingDataToLocalStorage("dates", {
      dates: {
        firstDay: firstSelectedDate,
        secondDay: secondSelectedDate,
      },
    });

    // active all clear date button true to show btn.
    toggleAllDateClearBtn(true, firstSelectedDate, secondSelectedDate);
  } else {
    // second step
    if (clickedDate === firstSelectedDate) return;

    // check if the clicked date is smaller than the first selected date
    if (
      new Date(firstSelectedDate) > new Date(clickedDate) &&
      !secondSelectedDate
    ) {
      document
        .getElementsByClassName(firstSelectedDate)[0]
        ?.classList?.remove("selected");

      // update new first selected date
      el.classList.add("selected");
      firstSelectedDate = clickedDate;
      firstSelectedEl = el;

      if (isHomePage) {
        await updatePackInPackOut("pack-in-date", new Date(clickedDate));
      }

      // save the first selected date in the local storage;
      await setBookingDataToLocalStorage("dates", {
        dates: {
          firstDay: firstSelectedDate,
          secondDay: secondSelectedDate,
        },
      });
      return;
    }

    // second selected date exist
    if (new Date(firstSelectedDate) > new Date(clickedDate)) {
      // if the difference more than 7 days return with alert.
      const returnedResult = await getTheDifferenceOfTwoDates(
        clickedDate,
        secondSelectedDate
      );

      if (returnedResult === "exit") return;

      const prevFirstSelectedDate = firstSelectedDate;
      firstSelectedDate = clickedDate;
      const error = await checkDisabledDate();
      if (error === "exit") {
        firstSelectedDate = prevFirstSelectedDate;
        return;
      }

      await addMiddleClassToDate();
      document
        .getElementsByClassName(prevFirstSelectedDate)[0]
        ?.classList?.remove("selected", "first-selected-date");
      el.classList.add("selected", "first-selected-date");
      firstSelectedEl = el;

      if (isHomePage) {
        await updatePackInPackOut("pack-in-date", new Date(clickedDate));
      }

      // save the first selected date in the local storage;
      await setBookingDataToLocalStorage("dates", {
        dates: {
          firstDay: firstSelectedDate,
          secondDay: secondSelectedDate,
        },
      });
      return;
    }

    const result = await getTheDifferenceOfTwoDates(
      firstSelectedDate,
      clickedDate
    );

    if (result === "exit") return;

    const prevSecondSelectedDate = secondSelectedDate;
    secondSelectedDate = clickedDate;
    const error = await checkDisabledDate();
    if (error === "exit") {
      secondSelectedDate = prevSecondSelectedDate;
      return;
    }

    await addMiddleClassToDate();

    // active all clear date button true to show btn.
    toggleAllDateClearBtn(true, firstSelectedDate, secondSelectedDate);

    // remove select class from the previous selected date.
    document
      .getElementsByClassName(prevSecondSelectedDate)[0]
      ?.classList?.remove("selected", "second-selected-date");

    if (isHomePage) {
      await updatePackInPackOut("pack-out-date", new Date(clickedDate));
    }

    // save the second selected date in the local storage;
    await setBookingDataToLocalStorage("dates", {
      dates: {
        firstDay: firstSelectedDate,
        secondDay: secondSelectedDate,
      },
    });
    el.classList.add("selected", "second-selected-date");
    document
      .getElementsByClassName(firstSelectedDate)[0]
      ?.classList.add("first-selected-date");
  }
}

function clearAllSelectedDate() {
  firstSelectedDate = null;
  secondSelectedDate = null;

  // clear all active classes like: selected, middle-date etc;
  clearActiveDates();

  // update local storage
  setBookingDataToLocalStorage("dates", {
    dates: null,
  });

  // update pack in packout label
  updatePackInPackOut("pack-in-date");
  updatePackInPackOut("pack-out-date");

  // toggle all clear date button
  toggleAllDateClearBtn();
}

function getTheDifferenceOfTwoDates(start, end) {
  // Calculate the difference in milliseconds
  const startDate = new Date(start);
  const endDate = new Date(end);
  const timeDifference = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to days
  let daysDifference = timeDifference / (1000 * 3600 * 24);
  if (Math.round(daysDifference) > 6) {
    activeAlertModal("Please select a maximum of 7 days.");
    return "exit";
  }
  if (Math.round(daysDifference) < 2) {
    activeAlertModal("Please select a minimum of 2 days.");
    return "exit";
  }
}

function updatePackInPackOut(element, date) {
  if (window.matchMedia("(max-width: 767px)").matches) {
    let formatedDate;
    if (date) {
      formatedDate = formateMobileDateForHomePage(date);
    }
    jQuery("#mobile-date-showing-el").text(
      formatedDate ? formatedDate : "Add date"
    );
    jQuery("#mobile-when-date-display").text(
      formatedDate ? formatedDate : "Select date"
    );
  } else {
    document.getElementsByClassName(element)[0].innerText = date
      ? formatDate(date)
      : "Add date";
  }
}

function formateMobileDateForHomePage(dateStr) {
  if (secondSelectedDate) {
    const firstDateStr = new Date(firstSelectedDate);
    const secondDateStr = new Date(secondSelectedDate);
    const firstMonthStr = firstDateStr.toLocaleString("default", {
      month: "short",
    });
    const secondMonthStr = secondDateStr.toLocaleString("default", {
      month: "short",
    });

    if (firstMonthStr === secondMonthStr) {
      return `${firstDateStr.getDate()} - ${secondDateStr.getDate()} ${secondMonthStr}`;
    }
    return (
      firstDateStr.getDate() +
      " " +
      firstMonthStr +
      " to " +
      secondDateStr.getDate() +
      " " +
      secondMonthStr
    );
  } else {
    const selectedDate = new Date(dateStr);
    const date = selectedDate.getDate();
    const month = selectedDate.toLocaleString("default", { month: "short" });
    return date + " " + month;
  }
}

function formatDate(date) {
  const monthName = getMonthName(date.getMonth());
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();
  // Format the date string
  const formattedDate = dayOfMonth + " " + monthName + " " + year;

  return formattedDate;
}

function checkDisabledDate() {
  const firstEl = document.getElementsByClassName(firstSelectedDate)[0];
  let currentEl = firstEl.nextElementSibling;
  let currentDate = firstSelectedDate;
  for (let i = 0; i < 7; i++) {
    // get the next date
    const dateObj = new Date(currentDate);
    dateObj.setDate(dateObj.getDate() + 1);
    const newDateString = dateObj.toISOString().slice(0, 10);
    currentDate = newDateString;

    // get the next el
    const currentEl = document.getElementsByClassName(newDateString)[0];

    if (!currentEl || new Date(newDateString) >= new Date(secondSelectedDate)) {
      break;
    }
    if (currentEl?.classList?.contains("disabled")) {
      activeAlertModal("Please select available dates");
      return "exit";
    }
    i++;
  }
}

function clearActiveDates() {
  jQuery(".day.selectable").each((_, el) => {
    // remove first or second selected date if it exist in the el;
    el.classList?.remove(
      "middle-date",
      "selected",
      "first-selected-date",
      "second-selected-date"
    );
  });
}

function addMiddleClassToDate() {
  jQuery(".day.selectable").each((_, el) => {
    const elDate = el.getAttribute("data-date");
    if (
      new Date(firstSelectedDate) < new Date(elDate) &&
      new Date(elDate) < new Date(secondSelectedDate)
    ) {
      // remove first or second selected date if it exist in the el;
      el.classList.remove("first-selected-date", "second-selected-date");
      el.classList.add("middle-date");
    } else {
      el.classList.remove("middle-date");
    }
  });
}

function getBookingDataFromLocalStorage() {
  return JSON.parse(localStorage.getItem("bookingData")) || {};
}

function setBookingDataToLocalStorage(dataType, data) {
  let bookingData = JSON.parse(localStorage.getItem("bookingData")) || {};
  if (!bookingData) {
    bookingData = {
      dataType: "dates",
      flexibleDates: null,
      dates: {
        firstDay: null,
        secondDay: null,
      },
      adultPersons: 0,
    };
  }

  bookingData = {
    ...bookingData,
    dataType,
    ...data,
  };

  localStorage.setItem("bookingData", JSON.stringify(bookingData));
}

function isCurrentMonth(month, year) {
  const runningMonth = new Date().getMonth();
  const runningYear = new Date().getFullYear();
  if (runningMonth === month && runningYear === year) {
    return true;
  }
  return false;
}

function getNextMonthAndYear(month, year) {
  if (month === 11) {
    month = 0;
    year++;
  } else {
    month++;
  }
  return { month, year };
}
function getPrevMonthAndYear(month, year) {
  if (month === 0) {
    month = 11;
    year--;
  } else {
    month--;
  }
  return { month, year };
}

async function updateSinglePageCalendar(month, year) {
  // parameters month, year = number, isSinglePage:boolean;
  const currentMonthHTML = await generateCalendar(month, year, true);

  // save the current month and current year in the calendar body
  jQuery(".single-page-date-calendar")?.attr({
    "data-year": year,
    "data-month": month,
  });

  jQuery("#current-month").html(currentMonthHTML);
  jQuery("#current-month-heading").text(getMonthName(month) + " " + year);
  jQuery("#current-month-heading").data("month", month);
  jQuery("#current-month-heading").data("year", year);

  // if user already selected some date add style in the ui.
  if (!firstSelectedDate) return;
  if (secondSelectedDate) {
    document
      .getElementsByClassName(firstSelectedDate)[0]
      ?.classList?.add("selected", "first-selected-date");
    document
      .getElementsByClassName(secondSelectedDate)[0]
      ?.classList?.add("selected", "second-selected-date");

    addMiddleClassToDate();
  }
}

async function updateHomePageCalendar(month, year) {
  // save the current month and current year in the calendar body
  jQuery(".home-date-calendar")?.attr({
    "data-year": year,
    "data-month": month,
  });

  // update current month calendar and heading.
  const currentMonthHTML = await generateCalendar(month, year);
  jQuery("#current-month").html(currentMonthHTML);
  jQuery("#current-month-heading").text(getMonthName(month) + " " + year);
  jQuery("#current-month-heading").data("month", month);
  jQuery("#current-month-heading").data("year", year);

  // calculate the next month and update next month calendar and heading;
  if (month === 11) {
    month = 0;
    year += 1;
  } else {
    month++;
  }
  const nextMonthHTML = await generateCalendar(month, year);
  jQuery("#next-month").html(nextMonthHTML);
  jQuery("#next-month-heading").text(getMonthName(month) + " " + year);

  // if user already selected some date add style in the ui.
  if (!firstSelectedDate) return;
  if (secondSelectedDate) {
    document
      .getElementsByClassName(firstSelectedDate)[0]
      ?.classList?.add("selected", "first-selected-date");
    document
      .getElementsByClassName(secondSelectedDate)[0]
      ?.classList?.add("selected", "second-selected-date");

    addMiddleClassToDate();
  }
}

/* ======================
        product search functions starts
                  ======================*/
async function handleSearch(e) {
  e.preventDefault();
  e.stopPropagation();
  await getProductByDates();
}

async function getProductByDates() {
  // hdie mobile popup modal if its a small device.
  if (window.matchMedia("(max-width: 767px)").matches) {
    jQuery("body").removeClass("modal-one").css("overflow-y", "auto");
  }

  // get the selected dates from
  const bookingDates = await getBookingDataFromLocalStorage();
  if (!bookingDates) {
    alert("please select dates");
    await activeAlertModal("Please select dates");
    return;
  }

  const homeProductContainer = jQuery("#home-products-container");

  // hide the calendar
  const datesCalendarWrap = jQuery("#dates-calendar-wrap");

  if (bookingDates.dataType === "dates") {
    if (!bookingDates.dates || !bookingDates.dates.firstDay) {
      await activeAlertModal("Please select dates.");
      return;
    }

    datesCalendarWrap.slideUp();
    homeProductContainer.html(
      `<div class="flex-center loading" ><h3>loading...</h3>
        </div>`
    );
    try {
      fetchProductByDates(
        bookingDates.dates.firstDay,
        bookingDates.dates.secondDay
      ).then((res) => {
        if (res?.status === 200) {
          renderSearchProduct(res.data?.result, bookingDates);
        } else {
          // show that no data found
          homeProductContainer.html(
            `<h3 class="flex-center empty-data">No data Found</h3>`
          );
        }
      });
    } catch (error) {
      // show the error
      console.log(error);
      homeProductContainer.html(
        `<h3 class="flex-center empty-data">No data Found</h3>`
      );
    }
  }
  // get basecamp list by flexible dates
  if (bookingDates.dataType === "flexible") {
    const selectedMonthObjKeys = Object.keys(
      bookingDates?.flexibleDates?.selectedMonths
    );

    if (!selectedMonthObjKeys.length) {
      activeAlertModal("Please select months.");
      return;
    }

    datesCalendarWrap.slideUp();
    homeProductContainer.html(
      `<div class="flex-center loading" ><h3>loading...</h3>
        </div>`
    );

    // get the first selected month to get the weekends or weeks

    // const firstMonth = selectedMonthObjKeys[0];
    const firstMonth = months.find(
      (month) => bookingDates?.flexibleDates?.selectedMonths[month]
    );

    const month = months.indexOf(firstMonth);
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    /* as we are rendering flexible month from current month so if 
      the month index is smaller than the current month index meaning 
      its the next year. */
    const year = month < currentMonth ? currentYear + 1 : currentYear;
    try {
      let iterateMonthDates;
      let flexibleDatesType = "weekend";
      if (bookingDates?.flexibleDates?.type === "weekend") {
        iterateMonthDates = await getWeekends(year, month);
      } else if (bookingDates?.flexibleDates?.type === "week") {
        iterateMonthDates = await getWeeks(year, month);
        flexibleDatesType = "week";
      }

      const monthIndexes = Object.keys(iterateMonthDates);
      if (!monthIndexes.length) {
        return;
      }

      const listingsObj = {};

      await Promise.all(
        monthIndexes.map(async (indx) => {
          const data = await fetchProductByDates(
            iterateMonthDates[indx].start,
            bookingDates?.flexibleDates?.type === "week"
              ? iterateMonthDates[indx].end
              : ""
          );
          if (data?.status === 200) {
            data.data.result.forEach((listing) => {
              if (!(listing.id in listingsObj)) {
                listingsObj[listing.id] = {
                  id: listing.id,
                  name: listing.name,
                  listingImages: listing.listingImages,
                  price: listing.price,
                  startDate: iterateMonthDates[indx].start,
                  endDate: iterateMonthDates[indx].end,
                  thumbnailUrl:
                    listing.thumbnailUrl || listing.listingImages[0]?.url,
                };
              }
            });
          }
        })
      );

      const products = Object.values(listingsObj);
      // show the listings
      if (products.length) {
        renderSearchProduct(products, bookingDates);
      } else {
        homeProductContainer.html(
          `<h3 class="flex-center empty-data">No data Found. Please select another dates</h3>`
        );
      }
    } catch (error) {
      console.error(error);
      // show that no data found
      homeProductContainer.html(
        `<h3 class="flex-center empty-data">No data Found</h3>`
      );
    }
  }
}

function renderSearchProduct(products, bookingDates) {
  if (!products.length) {
    jQuery("#home-products-container").html(
      `<h3 class="flex-center empty-data">No basecamp available. Please select other dates.</h3>`
    );
    return;
  }
  let productHtml = "";
  const dateType = bookingDates.dataType;
  // create product html;
  products.forEach((product) => {
    let extraInfo = `adult_persons=${
      bookingDates.adultPersons ? bookingDates.adultPersons : 0
    }&date_type=${dateType}`;
    if (dateType === "dates") {
      // set the dates extra info
      extraInfo += `&first_day=${bookingDates.dates.firstDay}&second_day=${bookingDates.dates.secondDay}`;
    } else {
      // set the flexible dates extra info
      extraInfo += `&type=${bookingDates.flexibleDates.type}&first_day=${product.startDate}&second_day=${product.endDate}`;
    }
    productHtml += `
        <div class="product-item">
        <figure>
            <img src=${
              product.thumbnailUrl
                ? product.thumbnailUrl
                : product?.listingImages[0]?.url
            }>
        </figure>
        <div class="product-content">
            <h3 class="split-heading">${product.name}</h3>
            <p class="split-heading">Basecamp</p>
            <div class="explore-btn ">
                <a 
                class="btn"
                href="/basecamps/${product.id}?${extraInfo}" 
                >EXPLORE</a>
            </div>
        </div>
    </div>
        `;
  });

  jQuery("#home-products-container").html(productHtml);
}

function getWeekends(year, month) {
  const weekends = {};
  let totalWeekends = 1;

  // Get the total number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();

    // check if the next the day or previous day exist.
    if (dayOfWeek === 0 && day > 1 && day <= daysInMonth) {
      const start = new Date(year, month, day).toISOString().split("T")[0];
      const end = new Date(year, month, day + 1).toISOString().split("T")[0];
      weekends[totalWeekends] = { start, end };
      totalWeekends++;
    }
  }
  return weekends;
}

function getWeeks(year, month) {
  const weeks = {};
  let totalWeeks = 1;

  // Get the total number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();

    // check if the next the day or previous day exist.
    if (dayOfWeek === 0 && day + 6 <= daysInMonth) {
      const startDate = new Date(year, month, day + 1);
      const endDate = new Date(year, month, day + 7);

      // check if the start date and end date of the month is previous than current date
      if (
        startDate.getTime() < new Date().getTime() ||
        endDate.getTime() < new Date().getTime()
      ) {
        day += 6;
        continue;
      }

      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];
      weeks[totalWeeks] = { start, end };
      totalWeeks++;
      day += 6;
    }
  }
  return weeks;
}

function fetchProductByDates(start, end) {
  return jQuery.ajax({
    url: `${homeUrl}/wp-json/hostway/v1/listings/dates?firstDate=${start}&lastDate=${end}`,
    method: "GET",
    dataType: "json",
    success: function (response) {
      return response;
    },
    error: function (xhr, status, error) {
      return error;
    },
  });
}

// function to render mobile device calendar for homepage
async function renderMobileCalendar() {
  const calendarContainer = jQuery(".mobi-month-calendar-container");
  let calendarHTML = "";
  let date = new Date();
  let month = date.getMonth();
  let year = date.getFullYear();
  for (let i = 1; i <= 12; i++) {
    let temp = month;
    const currentMonthHtml = await generateCalendar(month, year);
    calendarHTML += `
   <div class="booking-calendar-heading">${getMonthName(month)} ${year}</div>
   <div class="mobi-month-dates">${currentMonthHtml}</div>
   `;
    month = month === 11 ? 0 : month + 1;
    year = temp === 11 ? year + 1 : year;
  }
  calendarContainer.html(calendarHTML);
}

async function updateSinglePageMobileCalendar() {
  await renderMobileCalendar();

  if (!firstSelectedDate) return;
  if (secondSelectedDate) {
    document
      .getElementsByClassName(firstSelectedDate)[0]
      ?.classList?.add("selected", "first-selected-date");
    document
      .getElementsByClassName(secondSelectedDate)[0]
      ?.classList?.add("selected", "second-selected-date");

    addMiddleClassToDate();
  }
}

// product page initial functions
function checkProductPageSelectedDates() {
  if (!firstSelectedDate || !secondSelectedDate) {
    activeAlertModal("Please select dates");
    return false;
  } else {
    updateDatesToLinksQuery(".navlink-for-checkout-page");
    return true;
  }
}

// update navigation link query value of product page;
function updateProductPageNavLinkQuery(params) {
  const linkEl = jQuery(".navlink-for-checkout-page");
  const href = linkEl.attr("href");
  let url = new URL(href);
  let linkSearchParams = url.searchParams;

  // update the params
  linkSearchParams.set("adult_persons", params.get("adult_persons"));
  linkSearchParams.set("date_type", params.get("date_type"));
  linkSearchParams.set("first_day", params.get("first_day"));
  linkSearchParams.set("second_day", params.get("second_day"));

  linkEl.attr("href", url.toString());
}

function updateDatesToLinksQuery(el) {
  const linkEl = jQuery(el);
  const href = linkEl.attr("href");
  let url = new URL(href);
  let linkSearchParams = url.searchParams;

  // update the params
  linkSearchParams.set("first_day", firstSelectedDate);
  linkSearchParams.set("second_day", secondSelectedDate);

  linkEl.attr("href", url.toString());
}

// checkout page script
// global variables of checkout page;
let pricePerNight;
let adultPersons;
let listingId;
let totalPrice;
let telCode;

// select by default.
let selectedCountry = "Afghanistan";

let formData = {
  firstName: "",
  lastName: "",
  email: "",
  telephone: "",
  zipCode: "",
  city: "",
  address: "",
  // fullName: "",
};

// function to update checkout form expiration date input
function handleExpirationInput(event) {
  const input = event.target;
  const value = input.value.trim();

  // Check if the pressed key is a number between 0-9
  const keyPressed = event.key;
  if (/^\d$/.test(keyPressed)) {
    // Check if the input already contains the maximum length (5 characters)
    if (value.length >= 5) {
      return;
    }

    // If the first character is 0 or 1, just update the input value
    if (value.length === 0 || (value.length === 1 && value.charAt(0) < "2")) {
      input.value = keyPressed;
    } else if (value.length === 1) {
      // If the first character is 2 or greater, add '0' before it and '/'
      input.value = `0${keyPressed}/`;
    } else if (value.length === 2 && value.charAt(1) === "/") {
      // If the second character is '/', allow only numbers from 0-1
      if (/^[0-1]$/.test(keyPressed)) {
        input.value += keyPressed;
      }
    } else if (value.length === 3 && value.charAt(2) === "/") {
      // If the third character is '/', allow only numbers from 0-9
      if (/^\d$/.test(keyPressed)) {
        input.value += keyPressed;
      }
    }
  }
}

// function to handle tel phone country option
function updateCountryTelCode(event) {
  const parentEl = event.target;
  const index = parentEl?.selectedIndex;
  const selectedOption = parentEl?.options[index];
  const countryShortName = selectedOption.getAttribute("data-short-name");
  const phoneCode = selectedOption.value;
  const countryText = `${countryShortName} ${phoneCode}`;
  jQuery(".phone-country-code-display-el").text(countryText);
  telCode = phoneCode;
}

function updateSelectedCountry(event) {
  const parentEl = event.target;
  const index = parentEl?.selectedIndex;
  const selectedOption = parentEl?.options[index];
  const countryVal = selectedOption.value;
  selectedCountry = countryVal;
}

function openCalendarModal() {
  if (window.matchMedia("(max-width: 767px)").matches) {
    jQuery("#single-basecamp-mobile-calendar").removeClass("hidden");
  } else {
    jQuery(".checkout-popup-calendar").removeClass("disable");
  }
}

// functions to close checkout popup calendar
jQuery(".chckout-modal-disable-btn, .checkout-popup-calendar").on(
  "click",
  function () {
    this.classList?.add("disable");
  }
);

jQuery(".checkout-popup-calendar-inner").on("click", function (e) {
  e.stopPropagation();
  return;
});

// fn to close calendar modal and update checkout price and dates
async function closeCheckoutCalendarModalAndUpdate() {
  // await updateDatesToLinksQuery(linkEl);
  // updateCheckoutDateAndPrice(
  //   firstSelectedDate,
  //   secondSelectedDate,
  //   pricePerNight
  // );
  activeAlertModal("Updating...");
  updateCheckoutSelectedDateInput(firstSelectedDate, secondSelectedDate);
  calculateTotalPriceAndUpdate(basecampId, reservationCouponId);

  // get the adult person from global variable.
  upateCheckoutSelectedAdults(adultPersons);
  updateAdultPersonInputValue(adultPersons);

  // close calendar
  if (window.matchMedia("(max-width: 767px)").matches) {
    jQuery("#single-basecamp-mobile-calendar").addClass("hidden");
  } else {
    jQuery(".checkout-popup-calendar").addClass("disable");
  }
}

async function calculateTotalPriceAndUpdate(basecampId, voucherId = "") {
  const postBody = {
    listingId: basecampId,
    startingDate: firstSelectedDate,
    endingDate: secondSelectedDate,
    reservationCouponId: voucherId,
  };

  let url = "";
  if (homeUrl) {
    url = homeUrl + "/wp-json/hostway/v1/calculate-price";
  } else {
    url = window.location.origin + "/wp-json/hostway/v1/calculate-price";
  }

  // get price details based on the selected date, VoucherId(Optional)
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // get the result if the fetching success;
    const results = await response.json();
    if (results?.status === 200 && results?.data?.result) {
      // loop and show the updated price in the ui
      renderPriceDetails(results?.data?.result);
    } else {
      activeAlertModal(
        "Server error while getting updated data. Please select dates and update again."
      );
    }
  } catch (error) {
    console.log("error: ", error.message);
    activeAlertModal(
      "Server error while getting updated data. Please select dates and update again."
    );
  }
}

// render price details in the ui
async function renderPriceDetails(results) {
  // get the total nights
  const totalNights = await dateDiffInDays(
    firstSelectedDate,
    secondSelectedDate
  );

  // get the price detials contianer;
  let priceContainer;
  if (window.matchMedia("(max-width: 767px)").matches) {
    priceContainer = jQuery(".price-details-content.small-devices");

    jQuery(".due-today-price-val").text(results.totalPrice);
  } else {
    priceContainer = jQuery(".price-details-content.large-devices");
  }

  let basePrice = priceContainer.attr("data-base-price")
    ? priceContainer.attr("data-base-price")
    : pricePerNight;

  // create price deatails html el;
  let priceHtml = '<div class="price-details-container">';
  let index = 1;
  results?.components?.forEach((item) => {
    // render the calculate price and night html (734 x 3 nights.)
    if (index === 1) {
      priceHtml += `<div class="price-row">
                                <div class="price-title">$<span class="base-price-amount">${basePrice}</span> x <span class="total-night-text">${totalNights} Nights</span></div>
                                <div class="price-value">$<span class="total-nights-price">${
                                  item.total || totalNights * basePrice
                                }</span></div>
                            </div>`;
    } else {
      if ("discount" === item?.type) {
        priceHtml += `<div class="price-row">
                                <div class="price-title"><span>Voucher Discounts</span></div>
                                <div class="price-value"> - $<span class="total-taxes-price">${Math.abs(
                                  item.total
                                )}</span></div>
                             </div>`;
      } else {
        priceHtml += `<div class="price-row">
                                <div class="price-title"><span>${item.title}</span></div>
                                <div class="price-value">$<span class="total-taxes-price">${item.total}</span></div>
                            </div>`;
      }
    }
    index++;
  });

  priceHtml += `<hr class="section-divider" />
                      <div class="price-row">
                          <div class="price-title"><span>Total</span></div>
                          <div class="price-value">$<span class="total-price-el">${results.totalPrice}</span></div>
                      </div>
                      
                    </div>`;

  // appdend the price html;
  priceContainer.html(priceHtml);
  hideAlertModal();
}

// fn to update all price and dates in checkout page.
async function updateCheckoutPage(params) {
  // update total price and due today price
  let price = params.get("price");
  let firstDay = params.get("first_day");
  let secondDay = params.get("second_day");
  let person = params.get("adult_persons");

  // return if price doesn't exist in the url params;
  if (!price) return;
  // set the global variable
  pricePerNight = price;
  adultPersons = person;

  // updateCheckoutDateAndPrice(firstDay, secondDay, price);
  await updateCheckoutSelectedDateInput(firstDay, secondDay);
  // update selected adult persons
  if (person) {
    upateCheckoutSelectedAdults(person);
    updateAdultPersonInputValue(person);
  }
}

// increase decrease function for adult count.
function decreaseAdultCount(e) {
  let input = null;
  if ($(window).width() >= 768) {
    input = $(".desktop.adult-input-num");
  } else {
    input = $(".mobile.adult-input-num");
  }
  let value = parseInt(input.val(), 10);
  if (value > 0) {
    value--;
    input.val(value > 0 ? `0${value}` : value); // corrected input variable
    // update adult person to local storage
    adultPersons = value;
    let bookingData = getBookingDataFromLocalStorage();
    setBookingDataToLocalStorage(
      bookingData.dataType ? bookingData.dataType : "dates",
      {
        adultPersons: value,
      }
    );

    // update the checkout page input value
    if ($(".selected-adults-input").length > 0) {
      // corrected jQuery selector
      upateCheckoutSelectedAdults(value);
    }
  } else {
    activeAlertModal("Minimum capacity not met");
  }
}

function increaseAdultCount(e) {
  let input = null;
  if ($(window).width() >= 768) {
    input = $(".desktop.adult-input-num");
  } else {
    input = $(".mobile.adult-input-num");
  }
  let value = parseInt(input.val(), 10);
  if (value < 2) {
    value++;
    input.val(value > 0 ? `0${value}` : value);
    // Update adult person to local storage
    adultPersons = value;
    let bookingData = getBookingDataFromLocalStorage();
    setBookingDataToLocalStorage(
      bookingData.dataType ? bookingData.dataType : "dates",
      {
        adultPersons: value,
      }
    );
    // Update the checkout page input value
    if ($(".selected-adults-input").length > 0) {
      upateCheckoutSelectedAdults(value);
    }
  } else {
    activeAlertModal("Maximum capacity exceeded");
  }
}

function updateAdultPersonInputValue(adultPersons) {
  let inputVal = adultPersons === 0 ? "0" : "0" + adultPersons;
  if (jQuery(".desktop.adult-input-num").length > 0) {
    jQuery(".desktop.adult-input-num").val(inputVal);
  }
  if (jQuery(".mobile.adult-input-num").length > 0) {
    jQuery(".mobile.adult-input-num").val(inputVal);
  }
}

// fn to update checkout page dates and price
// async function updateCheckoutDateAndPrice(firstDay, secondDay, pricePerNight) {
//   // const totalPriceEl = jQuery(".total-price-val");
//   // const dueTodayPriceEl = jQuery(".due-today-price-val");

//   // calculate total price
//   const totalDays = await dateDiffInDays(firstDay, secondDay);
//   const totalAmount = totalDays * parseInt(pricePerNight);
//   if (totalAmount) {
//     totalPriceEl.text(totalAmount);
//     dueTodayPriceEl.text(totalAmount);
//     // update the global total price
//   } else {
//     totalPriceEl.text(pricePerNight);
//     dueTodayPriceEl.text(pricePerNight);
//   }
//   await updateCheckoutSelectedDateInput(firstDay, secondDay);
// }

// update selected date and adults persons input
function updateCheckoutSelectedDateInput(firstDay, secondDay) {
  let inputText = "Select Dates";
  if (firstDay) {
    const firstDate = new Date(firstDay).getDate();
    const secondDate = new Date(secondDay).getDate();
    const monthIndx = new Date(firstDay).getMonth();
    const monthName = getMonthShortName(getMonthName(monthIndx));
    inputText = monthName + " " + firstDate + " - " + secondDate;
    jQuery(".selected-date-input").val(inputText);
  } else {
    jQuery(".selected-date-input").val(inputText);
  }
}

function dateDiffInDays(date1, date2) {
  // Parse the provided dates
  var date1Parts = date1.split("-");
  var date2Parts = date2.split("-");
  var date1Obj = new Date(date1Parts[0], date1Parts[1] - 1, date1Parts[2]);
  var date2Obj = new Date(date2Parts[0], date2Parts[1] - 1, date2Parts[2]);

  // Calculate the difference in milliseconds
  var timeDiff = Math.abs(date2Obj.getTime() - date1Obj.getTime());

  // Calculate the difference in days
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return diffDays;
}

// Global variables for stripe payments
let stripe;
let elements;

async function requestReservation() {
  activeAlertModal("processing...");

  // make reservation request.
  // check if any field empty
  let formErrors;
  for (let key in formData) {
    if (key !== "message" && !formData[key]) {
      jQuery(`.checkout-form-input[data-name='${key}']`).css(
        "border",
        "1px solid rgb(196, 58, 58)"
      );
      formErrors = true;
    }
  }

  // const dateInput = jQuery(".checkout-form-input-date");

  // if (!dateInput.val()) {
  //   dateInput.css("border", "1px solid rgb(196, 58, 58)");
  //   formErrors = true;
  // }

  // check for input error;
  if (formErrors) {
    activeAlertModal("Please fill all inputs");
    return false;
  }

  // check if starting date and ending date
  if (!firstSelectedDate || !secondSelectedDate) {
    activeAlertModal("please select dates for reservation");
    return false;
  }

  formData.telephone = telCode + formData.telephone;

  // delete code

  // create a reservation
  // reservation post body obj
  const postBody = {
    startingDate: firstSelectedDate,
    endingDate: secondSelectedDate,
    numberOfGuests: adultPersons,
    reservationCouponId: reservationCouponId,
    listingId: listingId,
    price: totalPrice,
    firstName: formData.firstName,
    lastName: formData.lastName,
    zipCode: formData.zipCode,
    address: formData.address,
    city: formData.city,
    country: selectedCountry,
    email: formData.email,
    phone: formData.telephone,
    currency: "USD",
    comment: formData.message,
    // paymentMethodId,
    // clientSecret,
    // paymentId,
  };

  // Make API call for reservation using fetch
  try {
    const response = await fetch(
      `${homeUrl}/wp-json/hostway/v1/reservations/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
    return;
    if (responseData.status === 200) {
      activeAlertModal("Reservation success");

      //  dealy the redirection for addons page or home page 1000ms;
      setTimeout(() => {
        // check if addons exist then redirect to addons page if not then home page
        // check if addons exist for this basecamp
        const addonsCount = jQuery("#checkout-page").attr(
          "data-basecamp-addons"
        );
        if (parseInt(addonsCount)) {
          const { channelReservationId, hostawayReservationId, reservationId } =
            responseData?.data?.result;
          // window.location.href = `${homeUrl}/addons?checkout_id=${listingId}&reservation_id=${reservationId}&hostway_reservation_id=${hostawayReservationId}&channel_reservation_id=${channelReservationId}&adults=${adultPersons}&first_day=${firstSelectedDate}&second_day=${secondSelectedDate}&total_price=${totalPrice}&reservationCouponId=${reservationCouponId}`;
        } else {
          activeAlertModal("Thank you for your reservation.");
          // setTimeout(() => {
          //   let count = 3;
          //   const intervalId = setInterval(() => {
          //     if (count === 0) {
          //       clearInterval(intervalId);
          //       hideAlertModal();
          //       window.location.href = homeUrl;
          //     } else {
          //       activeAlertModal(`Redirecting to Home page in ${count}`);
          //       count--;
          //     }
          //   }, 700);
          // }, 1000);
        }
      }, 1000);
    } else if (responseData.status === 400) {
      const errMessage = responseData?.result?.message;
      activeAlertModal(errMessage);
    }
  } catch (error) {
    console.error("Error:", error);
    activeAlertModal(
      "Reservation Failed: Some required information is missing. Please fill in all required fields and try again."
    );
  }
  // delete code
  return;
  // setup stripe payment
  try {
    const { setupIntent, error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) throw new Error(error.message);

    // Handle successful setup confirmation
    const paymentMethodId = setupIntent?.payment_method;
    const clientSecret = setupIntent?.client_secret;
    const paymentId = setupIntent?.id;

    // create a reservation
    // reservation post body obj
    const postBody = {
      startingDate: firstSelectedDate,
      endingDate: secondSelectedDate,
      numberOfGuests: adultPersons,
      reservationCouponId: reservationCouponId,
      listingId: listingId,
      price: totalPrice,
      firstName: formData.firstName,
      lastName: formData.lastName,
      zipCode: formData.zipCode,
      address: formData.address,
      city: formData.city,
      country: selectedCountry,
      email: formData.email,
      phone: formData.telephone,
      currency: "USD",
      comment: formData.message,
      paymentMethodId,
      clientSecret,
      paymentId,
    };

    // Make API call for reservation using fetch
    try {
      const response = await fetch(
        `${homeUrl}/wp-json/hostway/v1/reservations/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postBody),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log(responseData);
      return;
      if (responseData.status === 200) {
        activeAlertModal("Reservation success");

        //  dealy the redirection for addons page or home page 1000ms;
        setTimeout(() => {
          // check if addons exist then redirect to addons page if not then home page
          // check if addons exist for this basecamp
          const addonsCount = jQuery("#checkout-page").attr(
            "data-basecamp-addons"
          );
          if (parseInt(addonsCount)) {
            const {
              channelReservationId,
              hostawayReservationId,
              reservationId,
            } = responseData?.data?.result;
            // window.location.href = `${homeUrl}/addons?checkout_id=${listingId}&reservation_id=${reservationId}&hostway_reservation_id=${hostawayReservationId}&channel_reservation_id=${channelReservationId}&adults=${adultPersons}&first_day=${firstSelectedDate}&second_day=${secondSelectedDate}&total_price=${totalPrice}&reservationCouponId=${reservationCouponId}`;
          } else {
            activeAlertModal("Thank you for your reservation.");
            // setTimeout(() => {
            //   let count = 3;
            //   const intervalId = setInterval(() => {
            //     if (count === 0) {
            //       clearInterval(intervalId);
            //       hideAlertModal();
            //       window.location.href = homeUrl;
            //     } else {
            //       activeAlertModal(`Redirecting to Home page in ${count}`);
            //       count--;
            //     }
            //   }, 700);
            // }, 1000);
          }
        }, 1000);
      } else if (responseData.status === 400) {
        const errMessage = responseData?.result?.message;
        activeAlertModal(errMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      activeAlertModal(
        "Reservation Failed: Some required information is missing. Please fill in all required fields and try again."
      );
    }

    console.log(setupIntent);
  } catch (error) {
    console.log(error);
    activeAlertModal(error?.message);
    return;
  }
}

// request coupon script starts
async function requestCoupon() {
  let couponInput;
  if (window.matchMedia("(max-width: 767px)").matches) {
    couponInput = jQuery("#coupone-input.small-device");
  } else {
    couponInput = jQuery("#coupone-input.large-device");
  }

  if (!couponInput.val()) {
    return;
  }
  activeAlertModal("Please wait...");

  // post body
  const postBody = {
    couponCode: couponInput.val(),
    listingId: listingId,
    startingDate: firstSelectedDate,
    endingDate: secondSelectedDate,
  };

  // make AJAX request.
  try {
    const response = await fetch(
      `${homeUrl}/wp-json/hostway/v1/verify-coupon`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    if (responseData.status === 200 && responseData.reservationCouponId) {
      //  update addons page link and set reservationCouponId globally;
      reservationCouponId = responseData.reservationCouponId;

      // fetch price details data based on coupon code
      calculateTotalPriceAndUpdate(
        basecampId,
        responseData.reservationCouponId
      );

      hideAlertModal();
      // updateCheckoutDateAndPrice(firstSelectedDate,secondSelectedDate,pricePerNight)
    } else if (responseData.status === 400) {
      // activeAlertModal(responseData?.result?.message?responseData?.result?.message:"Invalid Voucher Code");
      activeAlertModal("Invalid Voucher Code");
      couponInput.val("");
    }
  } catch (error) {
    console.error("Error:", error);
    activeAlertModal(error.message);
    couponInput.val("");
  }
}

// checkout form input handler
const formInputs = jQuery(".checkout-form-input");
formInputs.each((_, input) => {
  jQuery(input).on("keyup", function (e) {
    const key = e?.target?.getAttribute("data-name");
    const value = e?.target?.value;
    if (key) {
      formData[key] = value;
    }
  });
});

// checkout form input handler for dates
jQuery(".checkout-form-input-date").on("keyup", handleExpirationInput);

// function to update checkout form expiration date input
let expirationDateInputVal = "";
function handleExpirationInput(event) {
  const input = event.target;
  const value = input.value;

  if (value) {
    jQuery(".checkout-form-input-date").css("border", "1px solid #393b44");
  }

  const keyPressed = event.key;
  const parsedKey = parseInt(keyPressed);

  // check for backspace
  if (event.key === "Backspace" || event.keyCode === 8) {
    if (expirationDateInputVal.length === 3) {
      input.value = expirationDateInputVal[0];
      expirationDateInputVal = expirationDateInputVal[0];
    } else {
      let len = expirationDateInputVal.length;
      input.value = expirationDateInputVal.slice(0, len - 1);
      expirationDateInputVal = expirationDateInputVal.slice(0, len - 1);
    }
    return;
  }

  if (!isNaN(parsedKey)) {
    if (expirationDateInputVal.length >= 5) {
      input.value = expirationDateInputVal;
      return;
    }
    // Check if the input already contains the maximum length (5 characters)

    if (expirationDateInputVal.length === 0) {
      if (parsedKey < 2) {
        input.value = keyPressed;
        expirationDateInputVal = keyPressed;
      } else {
        let formatedValue = `0${parsedKey}/`;
        input.value = formatedValue;
        expirationDateInputVal = formatedValue;
      }
      return;
    }

    if (expirationDateInputVal.length === 1) {
      // return if user press 0 again or user press number more than 2
      if (
        (expirationDateInputVal.charAt(0) == "0" && parsedKey === 0) ||
        (expirationDateInputVal.charAt(0) != "0" && parsedKey > 2)
      ) {
        input.value = expirationDateInputVal;
        return;
      }
      input.value = `${expirationDateInputVal}${parsedKey}/`;
      expirationDateInputVal = `${expirationDateInputVal}${parsedKey}/`;
    } else {
      input.value = expirationDateInputVal.concat(parsedKey);
      expirationDateInputVal = expirationDateInputVal.concat(parsedKey);
    }
  } else {
    input.value = expirationDateInputVal;
  }
}

// remove border when user pass values
formInputs.each((_, input) => {
  jQuery(input).on("keyup", function (e) {
    const key = e?.target?.getAttribute("data-name");
    const value = e?.target?.value;
    if (key === "message") return;

    if (value) {
      jQuery(`.checkout-form-input[data-name='${key}']`).css(
        "border",
        "1px solid #393b44"
      );
    } else {
      jQuery(`.checkout-form-input[data-name='${key}']`).css(
        "border",
        "1px solid rgb(196, 58, 58)"
      );
    }
  });
});

function upateCheckoutSelectedAdults(val) {
  let inputText;
  if (val === 0) {
    inputText = "Select Adults";
  } else {
    inputText = `0${val} ${val > 1 ? "adults" : "adult"}`;
  }
  jQuery(".selected-adults-input").val(inputText);
}

// addons page script starts.
let addonsTotalPrice;
const kitPrice = {};
let selectedAdonsAmount = 0;
let reservationDetails = {
  basecampId: "",
  reservationId: "",
  hostwayReservationId: "",
  channelReservationId: "",
  firstDate: "",
  secondDate: "",
  adults: "",
  reservationCouponId: "",
};
function updateKitCount(event, action) {
  const addonsTotalInputs = document.querySelectorAll(".due-today-price-val");
  if (!addonsTotalPrice) {
    addonsTotalInputs.forEach((el) => {
      addonsTotalPrice = parseFloat(el.textContent);
    });
  }
  const clickedBtn = event?.currentTarget;
  const basePrice = clickedBtn.getAttribute("data-base-amount");
  const feeId = clickedBtn.getAttribute("data-id");
  const inputClassName = `.input-num.${feeId}`;
  const input = jQuery(inputClassName);
  const inputVal = input.val() + "";

  if (parseInt(inputVal) === 0 && action === "decrease") return;

  // increase or decrease conditionaly
  let updatedVal;
  let updatedPrice;
  if (action === "increase") {
    updatedVal = parseInt(inputVal) + 1;
    selectedAdonsAmount++;
    updatedPrice = addonsTotalPrice + parseInt(basePrice);
  } else {
    updatedVal = parseInt(inputVal) - 1;
    selectedAdonsAmount--;
    updatedPrice = addonsTotalPrice - parseInt(basePrice);
  }

  // disable purchase-now-btn if the addons is not selected
  jQuery(".purchase-now-btn") &&
    jQuery(".purchase-now-btn").each((_, btn) => {
      if (
        selectedAdonsAmount &&
        jQuery(".privacy-policy-checkbox").prop("checked")
      ) {
        jQuery(btn).css("pointer-events", "auto");
        jQuery(btn).css("cursor", "pointer");
      } else {
        jQuery(btn).css("pointer-events", "none");
        jQuery(btn).css("cursor", " not-allowed");
      }
    });

  // hide or show no thanks button

  const noThanksBtn = jQuery(".home-link.purchase-now-btn");
  if (selectedAdonsAmount) {
    noThanksBtn.css("visibility", "hidden");
    noThanksBtn.css("pointer-events", "none");
  } else {
    noThanksBtn.css("pointer-events", "auto");
    noThanksBtn.css("cursor", "pointer");
    noThanksBtn.css("visibility", "visible");
  }

  const addonsIdentity = `h3.${feeId}.addons-name`;
  const addonsName = jQuery(addonsIdentity).text();
  let totalPrice = parseInt(basePrice) * parseInt(inputVal);
  kitPrice[feeId] = {
    totalPrice,
    amount: updatedVal,
    name: addonsName,
  };

  // update input val
  input.val(updatedVal);

  //  create a function to update due today price.
  updateAddonsPageTotalPrice(updatedPrice);
}

function updateAddonsPageTotalPrice(totalPrice) {
  document.querySelectorAll(".due-today-price-val").forEach((el) => {
    el.innerText = totalPrice;
    addonsTotalPrice = totalPrice;
  });
}

function calculateAddonsPageTotalPrice() {
  const currentUrl = window.location.href;
  const urlParams = new URLSearchParams(currentUrl);
  const firstDate = urlParams.get("first_day");
  const secondDate = urlParams.get("second_day");
  const basecampId = urlParams.get("checkout_id");
  const reservationCouponId = urlParams.get("reservationCouponId");
  const reservationId = urlParams.get("reservation_id");
  const hostwayReservationId = urlParams.get("hostway_reservation_id");
  const channelReservationId = urlParams.get("channel_reservation_id");
  const adults = urlParams.get("adults");
  const checkoutTotalPrice = urlParams.get("total_price");

  reservationDetails = {
    ...reservationDetails,
    basecampId,
    reservationId,
    hostwayReservationId,
    channelReservationId,
    firstDate,
    secondDate,
    adults,
    reservationCouponId,
  };
}

// addon page purchase function
async function requestPurchase() {
  activeAlertModal("Processing Request. Please wait");
  const url = window.location.href;
  const urlParams = new URLSearchParams(url);
  const firstDate = urlParams.get("first_day");
  const secondDate = urlParams.get("second_day");
  const basecampId = urlParams.get("checkout_id");
  const hostwayReservationId = urlParams.get("hostway_reservation_id");

  // update this value if the user add reservation cupon.
  const reservationCouponId = "";
  /**
   *  name: "extra addons, update this as you need.
   * it will be the addons name in the addons page;
   * */
  let components = [];
  for (let key in kitPrice) {
    components.push({
      listingFeeSettingId: key,
      name: kitPrice[key].name,
      quantity: kitPrice[key].amount,
    });
  }

  if (!components.length) {
    activeAlertModal("Please select some addons first");
    return;
  }

  const postBody = {
    hostwayReservationId,
    reservationCouponId,
    components,
  };

  // make the request to update the reservation price with addons.
  try {
    const response = await fetch(
      `${homeUrl}/wp-json/hostway/v1/reservations/add-addons`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    if (responseData.status === 200) {
      activeAlertModal("Addons purched and adeed to reservation. Thank you.");
      // window.location.href();
      setTimeout(() => {
        activeAlertModal("Rdirecting to home page.");
      }, 1000);
      setTimeout(() => {
        hideAlertModal();
        window.location.href = homeUrl;
      }, 1700);
    } else if (responseData.status === 400) {
      const errMessage = responseData?.result?.message;
      activeAlertModal(errMessage);
    }
  } catch (error) {
    console.error("Error:", error);
    activeAlertModal(error.message);
  }
}

// stripe pament scripts starts

async function initializeStripe(id) {
  console.log("function called");
  // get the publishable key and payment intent secret key.

  let publishableKey = "";
  let paymentIntentSecret = "";

  // get the client secret and publishable key;
  let secretKeyUrl = `${homeUrl}/wp-json/hostway/v1/stripe-keys?listingId=${id}`;
  try {
    const response = await fetch(secretKeyUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: 500. Internal server error.`);
    }

    const results = await response.json();
    publishableKey =
      results?.publicKeyResult?.status === 200 &&
      results?.publicKeyResult?.data?.result?.stripePublishableApiKey;
    paymentIntentSecret =
      results?.setupIntentResult?.status === 200 &&
      results?.setupIntentResult?.data?.result?.clientSecret;
  } catch (error) {
    console.error(error);
    jQuery("#payment-element").text("Error: ", error?.message);
  }

  if (!publishableKey || !paymentIntentSecret) {
    activeAlertModal("Internal servar error");
    jQuery("#payment-element").text(
      "internal server error while rendering from"
    );
    return;
  }

  // stripe custom appearance starts
  const appearance = {
    theme: "stripe",

    variables: {
      colorPrimary: "#dcd4cf",
      colorBackground: "#14151A",
      colorText: "#dcd4cf",
      colorDanger: "#c43a3a",
      fontFamily: "Ideal Sans, system-ui, sans-serif",
      spacingUnit: "2px",
      borderRadius: "0px",
      fontSizeBase: "18px",
      // See all possible variables below
    },

    // rules to updates inputs, tab etc.
    rules: {
      ".Input:focus": {
        boxShadow: "none",
        border: "1px solid #393b44",
      },

      ".Input": {
        padding: "12px 10px 12px 20px",
        background: "transparent",
        border: "1px solid #393b44",
        color: "#dcd4cf",
        fontSize: "18px",
        fontWeight: "400",
      },
      ".Label": {
        paddingTop: " 10px",
        fontSize: " 0px !important",
        fontWeight: " 400",
        lineHeight: " 42px",
        // paddingBottom: " 35px",
        color: "transparent",
        textTransform: " none",
        letterSpacing: " 1.3px",
      },
    },
  };

  // stripe custom appearance ends
  stripe = Stripe(publishableKey);
  // elements = stripe.elements({ clientSecret: paymentIntentSecret, appearance });
  elements = stripe.elements({ clientSecret: paymentIntentSecret, appearance });

  // create an element
  const paymentEl = elements.create("payment", { layout: "tabs" });

  // mount the paymentEl in the dom;
  paymentEl.mount("#payment-element");
}

//   booking dates
document.addEventListener("DOMContentLoaded", async function () {
  // console.log(my_theme_var);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  localStorage.setItem("bookingData", JSON.stringify(""));
  if (window.matchMedia("(max-width: 767px)").matches) {
    if (jQuery(".mobile-calendar-header")?.length) {
      // render home page calendar for small device.
      await renderMobileCalendar();
      await generateFlexibleMonth();
      jQuery(".main-nav").css("display", "none");
    }
  } else {
    // load home page calendar.
    if (jQuery(".home-date-calendar")?.children()?.length > 0) {
      await updateHomePageCalendar(currentMonth, currentYear);
      await generateFlexibleMonth();
      jQuery(".main-nav").css("display", "none");
      jQuery(".flexible-month-wrap").slick({
        arrows: true,
        infinite: false,
        focusOnSelect: false,
        speed: 700,
        navigation: false,
        slidesToShow: 5, // Adjust the number of slides based on your design
        slidesToScroll: 1,
        dots: false,
        centerMode: false,
        // focusOnSelect: true,
      });

      if (window.matchMedia("(max-width: 1024px)").matches) {
        jQuery(".flexible-month-wrap").slick("unslick"); // Disable slick on mobile
      }
    }
  }

  // single basecamp page calendar.
  if (jQuery(".product-date-calendar")?.children()?.length > 0) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    // Format the date
    const minDate = `${year}-${month}-${day}`;

    // cancelation policy modal input;
    // set the input minimum and maximum value for date picker i
    jQuery("#cancelation-packin-input").attr("min", minDate);
    jQuery("#cancelation-packout-input").attr("min", minDate);

    // get the first and second available date from url
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const firstDay = params.get("first_day");
    const secondDay = params.get("second_day");

    if (firstDay && secondDay) {
      firstSelectedDate = firstDay;
      secondSelectedDate = secondDay;
    }

    const prevSelectedDate = new Date(firstDay ? firstDay : secondDay);
    let prevSelectedDateMonth = prevSelectedDate.getMonth();
    let prevSelectedDateYear = prevSelectedDate.getFullYear();

    if (!prevSelectedDateMonth && !prevSelectedDateYear) {
      prevSelectedDateMonth = currentMonth;
      prevSelectedDateYear = currentYear;
    }

    updateProductPageNavLinkQuery(params);

    if (window.matchMedia("(max-width: 767px)").matches) {
      await updateSinglePageMobileCalendar();
    } else {
      await updateSinglePageCalendar(
        prevSelectedDateMonth,
        prevSelectedDateYear
      );
    }
  }

  // checkout page initial functions
  if (jQuery("#checkout-page")?.children()?.length) {
    // load all initial functions of checkout page
    // get the first and second available date from url
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const firstDay = params.get("first_day");
    const secondDay = params.get("second_day");
    const id = params.get("checkout_id");

    listingId = id;
    initializeStripe(id);

    if (firstDay && secondDay) {
      firstSelectedDate = firstDay;
      secondSelectedDate = secondDay;
    }

    const prevSelectedDate = new Date(firstDay ? firstDay : secondDay);
    let prevSelectedDateMonth = prevSelectedDate.getMonth();
    let prevSelectedDateYear = prevSelectedDate.getFullYear();

    if (!prevSelectedDateMonth && !prevSelectedDateYear) {
      prevSelectedDateMonth = currentMonth;
      prevSelectedDateYear = currentYear;
    }

    await updateCheckoutPage(params);

    if (window.matchMedia("(max-width: 767px)").matches) {
      await updateSinglePageMobileCalendar();
    } else {
      await updateSinglePageCalendar(
        prevSelectedDateMonth,
        prevSelectedDateYear
      );
    }
    // await updateCheckoutPageNavLinkQuery(params);

    // attach event listeners on the privacy-policy-checkbox btn
    const linkBtn = jQuery(".navlink-for-addons-page");
    linkBtn.css("pointer-events", "none");
    linkBtn.css("cursor", " not-allowed");

    jQuery(".privacy-policy-checkbox").on("change", function (e) {
      const checked = e?.target?.checked;
      if (checked) {
        linkBtn.css("pointer-events", "auto");
        linkBtn.css("cursor", "pointer");
      } else {
        linkBtn.css("pointer-events", "none");
        linkBtn.css("cursor", " not-allowed");
      }
    });
  }
  // addons page initial functions
  if (jQuery("#addons-page")?.children()?.length) {
    await calculateAddonsPageTotalPrice();

    // attach event listeners on the privacy-policy-checkbox btn
    const linkBtn = jQuery(".navlink-for-addons-page");
    linkBtn.css("pointer-events", "none");
    linkBtn.css("cursor", " not-allowed");

    jQuery(".privacy-policy-checkbox").on("change", function (e) {
      const checked = e?.target?.checked;
      if (checked) {
        linkBtn.css("pointer-events", "auto");
        linkBtn.css("cursor", "pointer");
      } else {
        linkBtn.css("pointer-events", "none");
        linkBtn.css("cursor", " not-allowed");
      }
    });
  }
});

console.log("script loaded");
