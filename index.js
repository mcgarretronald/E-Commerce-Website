function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        image: params.get('image'),
        name: params.get('name'),
        price: params.get('price'),
        size: params.get('size'),
    };
}

function displayProductDetails() {
    const { image, name, price, size } = getQueryParams();
    document.getElementById('product-image').src =`/pics/limitedcollection/${image}`;
    document.getElementById('product-name').textContent = name;
    document.getElementById('product-price').textContent = `KES ${price}`;
    document.getElementById('product-size').textContent = `Size: ${size}`;
}
window.onload = displayProductDetails;
