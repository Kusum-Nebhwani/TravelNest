// code from index.ejs
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});
const categoryIcons = document.querySelectorAll(".filter");
const listingsContainer = document.getElementById("listings-container");
const originalOrder = Array.from(document.querySelectorAll(".listing-card")); // Keep track of original order

categoryIcons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    const categoryName = e.target.closest(".filter").dataset.category;
    const listings = document.querySelectorAll(".listing-card");
    let filteredListings = Array.from(listings).filter(
      (listing) => listing.dataset.category === categoryName
    );
    if (categoryName === "all") {
      filteredListings = originalOrder; // Restore original order for "All"
      listingsContainer.innerHTML = ""; // Clear the container
      filteredListings.forEach((listing) => {
        listingsContainer.appendChild(listing); // Append listings in the correct order
      });
    } else {
      filteredListings.forEach((listing) => {
        listingsContainer.insertBefore(listing, listingsContainer.firstChild);
      });
    }
  });
});

//code from index.ejs



document.addEventListener("DOMContentLoaded", () => {
  // Filtering functionality
  const categoryIcons = document.querySelectorAll(".filter");
  const listings = Array.from(document.querySelectorAll(".listing-card")); // All listing cards
  const flashMessageContainer = document.createElement('div'); // Create a container for flash messages
  flashMessageContainer.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show', 'col-6', 'offset-3');
  flashMessageContainer.setAttribute('role', 'alert');
  flashMessageContainer.style.display = 'none'; // Hide the flash message container by default
  flashMessageContainer.innerHTML = `
    <span id="flash-message-content"></span>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  document.body.insertBefore(flashMessageContainer, document.body.firstChild); // Insert the flash message container at the top of the body

  categoryIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const categoryName = e.target.closest(".filter").dataset.category;
      let visibleListings = 0;

      listings.forEach((listing) => {
        if (categoryName === "all" || listing.dataset.category === categoryName) {
          listing.style.display = "block"; // Show the listing
          visibleListings++;
        } else {
          listing.style.display = "none"; // Hide the listing
        }
      });

      // Show flash message if no listings are found
      if (visibleListings === 0) {
        document.getElementById('flash-message-content').textContent = `No listings found for "${categoryName}"`;
        flashMessageContainer.style.display = 'block';
      } else {
        flashMessageContainer.style.display = 'none';
      }
    });
  });
});

