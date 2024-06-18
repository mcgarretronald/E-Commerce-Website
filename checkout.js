document.addEventListener('DOMContentLoaded', function () {
    const purchaseForm = document.querySelector('form');
    const purchaseSubmissionText = document.getElementById("purchase-submission-text");

    purchaseForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Fetch input field values
        const email = document.getElementById('email').value.trim();
        const firstName = document.getElementById('FirstName').value.trim();
        const lastName = document.getElementById('LastName').value.trim();
        const size = document.getElementById('product-size').value.trim();
        const deliveryAddress = document.getElementById('DeliveryAddress').value.trim();
        const phoneNumber = document.getElementById('PhoneNumber').value.trim();

        // Validate input fields
        if (!email && !firstName && !lastName && !size && !deliveryAddress && !phoneNumber) {
            purchaseSubmissionText.textContent = "Please fill in all required fields.";
            return;
        }

        // Construct URL with query parameters
        const purchaseUrl = `sale.html`;

        // Redirect to sales.html
        window.location.href = purchaseUrl;
    });
});
