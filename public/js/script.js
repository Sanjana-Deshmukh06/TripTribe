document.addEventListener('DOMContentLoaded', function () {
  // Function to hide the preloader and show the content
  function hidePreloader() {
    var preloader = document.getElementById('preloader');
    var content = document.getElementById('content');

    // Check if elements exist to avoid errors
    if (preloader) {
      preloader.style.display = 'none';
    }
    if (content) {
      content.style.display = 'block';
    }
  }
  // Simulate a loading delay (for demonstration purposes)
  setTimeout(hidePreloader, 1000); // Adjust the delay as needed
});

//script for static validation for form-validation pages
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

//toggle switch script
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for (let info of taxInfo) {
        if (info.style.display != "inline") {
            info.style.display = "inline";
        } else {
            info.style.display = "none";
        }
    }
});

// pop up
document.addEventListener('DOMContentLoaded', function () {
  // Check if successMessage exists and is not empty
  if (successMessage && successMessage.length) {
      var successModal = new bootstrap.Modal(document.getElementById('successModal'));
      successModal.show();
  }

  // Check if errorMessage exists and is not empty
  if (errorMessage && errorMessage.length) {
      var errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
      errorModal.show();
  }
});


//icon logic

const tabs = document.querySelectorAll(".scrollable-tabs-container .filter-container a");
const rightArrow = document.querySelector(
  ".scrollable-tabs-container .right-arrow svg"
);
const leftArrow = document.querySelector(
  ".scrollable-tabs-container .left-arrow svg"
);
const filterContainer = document.querySelector(
  ".scrollable-tabs-container .filter-container"
);
const leftArrowContainer = document.querySelector(
  ".scrollable-tabs-container .left-arrow"
);
const rightArrowContainer = document.querySelector(
  ".scrollable-tabs-container .right-arrow"
);

const removeAllActiveClasses = () => {
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });
};


tabs.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    event.preventDefault();
    setActiveFilter(tab);
    window.location.href = tab.getAttribute("href");
  });
});

const setActiveFilter = (tab) => {
removeAllActiveClasses();
tab.classList.add("active");
localStorage.setItem("activeFilter", tab.getAttribute("href"));
};

// Check if there's a stored active filter and set it on page load
document.addEventListener("DOMContentLoaded", () => {
const storedFilter = localStorage.getItem("activeFilter");
if (storedFilter) {
  const activeTab = document.querySelector(`.filter[href="${storedFilter}"]`);
  if (activeTab) {
    setActiveFilter(activeTab);
  }
}
});


const manageIcons = () => {
  if (filterContainer.scrollLeft >= 20) {
    leftArrowContainer.classList.add("active");
  } else {
    leftArrowContainer.classList.remove("active");
  }

  let maxScrollValue = filterContainer.scrollWidth - filterContainer.clientWidth - 20;
  // console.log("scroll width: " + filterContainer.scrollWidth);
  // console.log("client width: " + filterContainer.clientWidth);
  // console.log("max scroll value: " + maxScrollValue);
  // console.log("scroll left value: " + filterContainer.scrollLeft);

  if (filterContainer.scrollLeft >= maxScrollValue) {
    rightArrowContainer.classList.remove("active");
  } else {
    rightArrowContainer.classList.add("active");
  }
};


rightArrow.addEventListener("click", () => {
  console.log("clicked");
  filterContainer.scrollLeft += 200;
  setTimeout(() => {
    manageIcons();
  }, 500);
});

leftArrow.addEventListener("click", () => {
  console.log("clicked");
  filterContainer.scrollLeft -= 200;
  setTimeout(() => {
    manageIcons();
  }, 500);
});

filterContainer.addEventListener("scroll", manageIcons);

let dragging = false;

const drag = (e) => {
  if(!dragging) return;
  filterContainer.classList.add("dragging");
  filterContainer.scrollLeft -= e.movementX;
}

filterContainer.addEventListener("mousedown", () => {
  dragging = true
})

filterContainer.addEventListener("mousemove", drag);

document.addEventListener("mouseup", () => {
  dragging = false;
  filterContainer.classList.remove("dragging");
})
