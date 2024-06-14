document.addEventListener('DOMContentLoaded', function () {
    const iconCart = document.querySelector(".iconCart");
    const closeCart = document.querySelector(".close");
    const body = document.querySelector("body");
    const posts = document.getElementById("productDetails");
    const cartItemCount = document.querySelector('.iconCart span');
    const cartList = document.querySelector('.listCart');
    const checkoutButton = document.querySelector('.checkout');

//    notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.style.position = 'fixed';
    notification.style.top = '90px';
    notification.style.right = '40%';
    notification.style.backgroundColor = 'orange';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '15px';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    notification.style.display = 'none';
    document.body.appendChild(notification);

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }

    // Load cart items from localStorage
    loadCartItems();

    // Event listener for showing/hiding the cart
    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    closeCart.addEventListener('click', () => {
        body.classList.remove('showCart');
    });

    checkoutButton.addEventListener('click', () => {
        // Collect cart items data
        const cartItems = Array.from(cartList.querySelectorAll('.listCart-item')).map(item => {
            const imageSrc = item.querySelector('.image img').src;
            const title = item.querySelector('h5').textContent.trim();
            const price = item.querySelector('.totalprice').textContent.trim().replace('$', '');
            const quantity = item.querySelector('.quantity').textContent.trim().replace('Quantity: ', '');
            return { imageSrc, title, price, quantity };
        });

        const purchaseUrl = 'purchase.html';
        if (cartItems.length > 0) {
            const params = new URLSearchParams();
            cartItems.forEach((item, index) => {
                params.append(`item${index + 1}_image`, item.imageSrc);
                params.append(`item${index + 1}_title`, item.title);
                params.append(`item${index + 1}_price`, item.price);
                params.append(`item${index + 1}_quantity`, item.quantity);
            });
            window.location.href = `${purchaseUrl}?${params.toString()}`;
        } else {
            showNotification('Your cart is empty. Add items to proceed to checkout.');
        }
    });

   
    function updateCartItemCount() {
        // Get the number of cart items from the cart list
        const itemsCount = cartList.querySelectorAll('.listCart-item').length;

        // Set the text content of the cart item count element to the number of cart items
        cartItemCount.textContent = itemsCount;
    }

    // Function to fetch and display products
    async function fetchAndDisplayPosts() {
        const link = 'https://fakestoreapi.com/products/';
        try {
            const response = await fetch(link);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            posts.innerHTML = '';

            if (responseData.length === 0) {
                posts.innerHTML = '<p>No products available.</p>';
                return;
            }

            responseData.forEach(data => {
                const productElement = document.createElement('div');
                productElement.classList.add('item');

                productElement.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                productElement.style.padding = '10px';
                productElement.style.margin = '10px';
                productElement.style.textAlign = 'center';
                productElement.style.maxWidth = '200px';
                productElement.style.display = 'inline-block';

                const titleElement = document.createElement('h5');
                titleElement.textContent = data.title;

                const imageElement = document.createElement('img');
                imageElement.src = data.image;
                imageElement.alt = data.title;
                imageElement.style.width = '200px';
                imageElement.style.height = '300px';

                const priceElement = document.createElement('p');
                priceElement.textContent = `Price: $${data.price.toFixed(2)}`;

                const addToCartButton = document.createElement('button');
                addToCartButton.textContent = 'Add to Cart';
                addToCartButton.classList.add('addCart');

                addToCartButton.addEventListener('click', () => {
                    const imageUrl = data.image;
                    const price = data.price.toFixed(2);
                    const title = data.title;
                    addItemToCart(title, imageUrl, price);

                    showNotification('Item added to cart.');
                });

                productElement.appendChild(titleElement);
                productElement.appendChild(imageElement);
                productElement.appendChild(priceElement);
                productElement.appendChild(addToCartButton);

                posts.appendChild(productElement);
            });
        } catch (error) {
            console.error('Error fetching:', error);
            posts.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        }
    }
  
  
    function addItemToCart(title, imageUrl, price) {
        // Check if the item already exists in the cart
        const existingCartItem = Array.from(cartList.querySelectorAll('.listCart-item')).find(item =>
            item.querySelector('h5').textContent === title
        );

        if (existingCartItem) {
            // If the item exists, increment the quantity
            const quantityElement = existingCartItem.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent.replace('Quantity: ', ''), 10);
            quantity++;
            quantityElement.textContent = `Quantity: ${quantity}`;
        } else {
            // If the item doesn't exist, create a new cart item
            const cartItem = document.createElement('div');
            cartItem.classList.add('listCart-item');

            // Create the image container
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image');
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Product Image';
            imageContainer.appendChild(img);
            cartItem.appendChild(imageContainer);

            // Create the title element
            const titleElement = document.createElement('h5');
            titleElement.textContent = title;
            cartItem.appendChild(titleElement);

            // Create the total price element
            const totalPrice = document.createElement('div');
            totalPrice.classList.add('totalprice');
            totalPrice.textContent = `$${price}`;
            cartItem.appendChild(totalPrice);

            // Create the quantity element
            const quantityElement = document.createElement('div');
            quantityElement.style.marginBottom = '20px';
            quantityElement.style.marginTop = '20px';
            quantityElement.classList.add('quantity');
            quantityElement.textContent = 'Quantity: 1';
            cartItem.appendChild(quantityElement);

            // Create the remove 
            const removeButton = document.createElement('span');
            const deleteIcon = document.createElement('i');
            deleteIcon.setAttribute('class', 'fa-solid fa-trash')
            removeButton.style.fontSize = '16px';
            removeButton.style.padding = '15px 15px';
            removeButton.style.marginTop = '20px';
            deleteIcon.style.color = 'red'
            removeButton.appendChild(deleteIcon);
            removeButton.classList.add('removeCartItem');
            removeButton.addEventListener('click', () => {
                cartItem.remove();
                saveCartItems();
                updateCartItemCount();
            });
            // decrement buttons
            const decrementButton = document.createElement('button');
            const decrementIcon = document.createElement('i');
            decrementIcon.setAttribute('class', '<i class="fa-solid fa-minus"></i>')
            decrementButton.style.fontSize = '16px';
            decrementButton.style.padding = '5px 5px';
            decrementButton.style.marginTop = '5px';
            decrementButton.textContent = 'Reduce';
            decrementButton.appendChild(decrementIcon);
            decrementButton.classList.add('decrementCartItem');
            decrementButton.addEventListener('click', () => {
                let quantity = parseInt(quantityElement.textContent.replace('Quantity: ', ''), 10);
                quantity--;
                if (quantity <= 0) {
                    cartItem.remove();
                } else {
                    quantityElement.textContent = `Quantity: ${quantity}`;
                }
                saveCartItems();
                updateCartItemCount();
            });

            cartItem.appendChild(removeButton);
            cartItem.appendChild(decrementButton);

            cartList.appendChild(cartItem);
        }

        saveCartItems();
        updateCartItemCount();
    }

    // Function to save cart items to localStorage
    function saveCartItems() {
        const cartItems = Array.from(cartList.querySelectorAll('.listCart-item')).map(item => {
            return {
                title: item.querySelector('h5').textContent,
                imageUrl: item.querySelector('.image img').src,
                price: item.querySelector('.totalprice').textContent.replace('$', ''),
                quantity: item.querySelector('.quantity').textContent.replace('Quantity: ', '')
            };
        });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

 
    function loadCartItems() {
        // Retrieve the saved cart items from localStorage, or an empty array if not found
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // For each saved cart item
        savedCartItems.forEach(item => {
            // Add the item to the cart
            addItemToCart(item.title, item.imageUrl, item.price);

            // Find the corresponding cart item in the cart list
            const cartItem = Array.from(cartList.children).find(
                cartItem => cartItem.querySelector('h5').textContent === item.title
            );

            // If the cart item is found
            if (cartItem) {
                // Update the quantity element with the saved quantity
                const quantityElement = cartItem.querySelector('.quantity');
                quantityElement.textContent = `Quantity: ${item.quantity}`;
            }
        });

        // Update the cart item count
        updateCartItemCount();
    }

    fetchAndDisplayPosts();
});
