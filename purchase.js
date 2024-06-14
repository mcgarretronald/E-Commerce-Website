document.addEventListener('DOMContentLoaded', function () {
    const cartItemsDiv = document.getElementById('cartItems');

    // Function to parse URL parameters
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return Array.from(params.keys()).reduce((acc, key) => {
            acc[key] = params.get(key);
            return acc;
        }, {});
    }

    // Function to retrieve cart items from localStorage
    function getLocalStorageCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        return cartItems;
    }

    // Function to display cart items based on URL parameters or localStorage
    function displayCartItems() {
        const params = getUrlParams();
        const cartItems = getLocalStorageCartItems();

        cartItemsDiv.innerHTML = ''; // Clear previous content

        if (cartItems.length === 0 && Object.keys(params).length === 0) {
            cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        if (Object.keys(params).length > 0) {
            // Display cart items from URL parameters
            const itemCount = Object.keys(params).filter(key => key.includes('_image')).length;

            for (let i = 1; i <= itemCount; i++) {
                const imageSrc = params[`item${i}_image`];
                const title = params[`item${i}_title`];
                const price = params[`item${i}_price`];

                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');

                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = 'Product Image';
                cartItemDiv.appendChild(img);

                const itemDetails = document.createElement('div');
                const titleElement = document.createElement('h3');
                titleElement.textContent = title;
                itemDetails.appendChild(titleElement);

                const priceElement = document.createElement('p');
                priceElement.textContent = `Price: $${price}`;
                itemDetails.appendChild(priceElement);

                cartItemDiv.appendChild(itemDetails);

                cartItemsDiv.appendChild(cartItemDiv);
            }
        } else {
            // Display cart items from localStorage
            cartItems.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');

                const imageElement = document.createElement('img');
                imageElement.src = item.image;
                imageElement.alt = 'Product Image';
                cartItemElement.appendChild(imageElement);

                const titleElement = document.createElement('h3');
                titleElement.textContent = item.title;
                cartItemElement.appendChild(titleElement);

                const priceElement = document.createElement('p');
                priceElement.textContent = `Price: $${item.price}`;
                cartItemElement.appendChild(priceElement);

                cartItemsDiv.appendChild(cartItemElement);
            });
        }
    }

    displayCartItems(); // Call the function to display cart items on page load

    // Handle BUY button click
    const buyButton = document.getElementById('buy-button');
    buyButton.addEventListener('click', function (event) {
        event.preventDefault();

        const cartItems = getLocalStorageCartItems();
        if (cartItems.length > 0) {
            const queryParams = cartItems.map((item, index) => {
                return `item${index + 1}_image=${encodeURIComponent(item.image)}&item${index + 1}_title=${encodeURIComponent(item.title)}&item${index + 1}_price=${encodeURIComponent(item.price)}`;
            }).join('&');

            const checkoutUrl = `checkout.html?${queryParams}`;
            window.location.href = checkoutUrl;
        }
    });
});


