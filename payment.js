document.addEventListener('DOMContentLoaded', () => {
    // Load payment details from sessionStorage
    const source = sessionStorage.getItem('source-location') || 'Not specified';
    const destination = sessionStorage.getItem('destination-location') || 'Not specified';
    const totalCost = sessionStorage.getItem('total-cost') || '0';
    
    // Update the payment details display
    document.getElementById('payment-source').textContent = source;
    document.getElementById('payment-destination').textContent = destination;
    document.getElementById('payment-total-cost').textContent = `Rs/-${totalCost}`;

    // Format card number input
    const cardNumberInput = document.getElementById('card-number');
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        if (value.length > 0) {
            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        e.target.value = value;
    });

    // Format expiry date input
    const expiryDateInput = document.getElementById('expiry-date');
    expiryDateInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // Handle form submission
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payButton = document.getElementById('pay-now-btn');
        const buttonText = payButton.querySelector('.btn-text');
        const loadingSpinner = payButton.querySelector('.loading-spinner');

        // Show loading state
        buttonText.style.display = 'none';
        loadingSpinner.classList.remove('hidden');
        payButton.disabled = true;

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            const container = document.querySelector('.container');
            container.innerHTML = `
                <div class="payment-success">
                    <div class="success-icon">✓</div>
                    <h1>Payment Successful!</h1>
                    <p>Your trip from ${source} to ${destination} has been booked successfully.</p>
                    <button onclick="window.location.href='index.html'" class="proceed-btn">
                        Return to Trip Planner
                    </button>
                </div>
            `;
        } catch (error) {
            // Reset button state on error
            buttonText.style.display = 'block';
            loadingSpinner.classList.add('hidden');
            payButton.disabled = false;
            alert('Payment failed. Please try again.');
        }
    });
});