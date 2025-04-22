// Budget allocation state
let budgetLimits = {
    hotel: 0.5,
    bus: 0.2,
    guide: 0.3
};

// Services data
const services = {
    buses: [
        {
            id: 1,
            name: "Luxury Coach",
            price: 2000,
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000",
            description: "Premium coach with reclining seats and WiFi"
        },
        {
            id: 2,
            name: "Standard Bus",
            price: 1200,
            rating: 4.0,
            image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1000",
            description: "Comfortable bus for group travel"
        },
        {
            id: 3,
            name: "Mini Bus",
            price: 600,
            rating: 4.2,
            image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&q=80&w=1000",
            description: "Perfect for smaller groups"
        }
    ],
    hotels: [
        {
            id: 1,
            name: "Grand Hotel",
            price: 12000,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
            description: "5-star luxury hotel with ocean view"
        },
        {
            id: 2,
            name: "Comfort Inn",
            price: 8000,
            rating: 4.2,
            image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1000",
            description: "3-star hotel with great amenities"
        },
        {
            id: 3,
            name: "Budget Lodge",
            price: 5000,
            rating: 3.8,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
            description: "Affordable comfort for travelers"
        }
    ],
    guides: [
        {
            id: 1,
            name: "Abhinav",
            price: 7000,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000",
            description: "Expert with 10 years experience"
        },
        {
            id: 2,
            name: "Keerthana",
            price: 5000,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000",
            description: "Specialized in cultural tours"
        },
        {
            id: 3,
            name: "Rama Krishna",
            price: 4000,
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1000",
            description: "Local expert and historian"
        }
    ]
};

const typeMap = {
    hotel: "hotels",
    bus: "buses",
    guide: "guides"
};

const state = {
    budget: 5000,
    selected: { bus: null, hotel: null, guide: null },
    bookings: { bus: { date: '', time: '' }, hotel: { date: '', time: '' }, guide: { date: '', time: '' } },
    locations: { source: '', destination: '' }
};

// Helper functions
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    let starsHTML = '';
    for (let i = 0; i < 5; i++) {
        starsHTML += i < fullStars ? '★' : '☆';
    }
    return `<div class="rating">${starsHTML} ${rating}</div>`;
}

function createCard(item, type, isSelected) {
    const isAffordable = item.price <= state.budget * budgetLimits[type];
    const disabled = !isAffordable && !isSelected;
    const tooltip = disabled ? 'Not affordable under current budget allocation' : '';

    return `
        <div class="card ${isSelected ? 'selected' : ''}" data-id="${item.id}" data-type="${type}">
            <img src="${item.image}" alt="${item.name}">
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${item.name}</h3>
                    ${createStarRating(item.rating)}
                </div>
                <p class="card-description">${item.description}</p>
                <div class="card-footer">
                    <span class="price">Rs/-${item.price}</span>
                    <button 
                        class="select-btn ${isSelected ? 'selected' : ''}" 
                        ${disabled ? 'disabled' : ''} 
                        title="${tooltip}">
                        ${isSelected ? 'Remove' : 'Select'}
                    </button>
                </div>
            </div>
        </div>
    `;
}


function updateBudgetDisplay() {
    const totalCost = calculateTotal();
    const remaining = state.budget - totalCost;
    document.getElementById('total-cost').textContent = `Rs/-${totalCost}`;
    const remainingEl = document.getElementById('remaining');
    remainingEl.textContent = `Rs/-${remaining}`;
    remainingEl.style.color = remaining >= 0 ? '#059669' : '#dc2626';
    updateBudgetLimits();
    updatePaymentButton();
}

function updateBudgetLimits() {
    ['hotel', 'bus', 'guide'].forEach(type => {
        const limit = state.budget * budgetLimits[type];
        const usage = getTypeUsage(type);
        const percentage = (usage / limit) * 100;
        document.getElementById(`${type}-limit-label`).textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} (${Math.round(budgetLimits[type] * 100)}%)`;
        document.getElementById(`${type}-progress`).style.width = `${Math.min(percentage, 100)}%`;
        document.getElementById(`${type}-progress`).className = `progress ${getProgressClass(percentage)}`;
        document.getElementById(`${type}-amount`).textContent = `Rs/-${usage} / Rs/-${Math.floor(limit)}`;
    });
}

function getProgressClass(percentage) {
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return '';
}

function getTypeUsage(type) {
    if (!state.selected[type]) return 0;
    const item = services[typeMap[type]].find(item => item.id === state.selected[type]);
    return item ? item.price : 0;
}

function calculateTotal() {
    return Object.entries(state.selected).reduce((total, [type, id]) => {
        if (!id) return total;
        const item = services[typeMap[type]].find(item => item.id === id);
        return total + (item ? item.price : 0);
    }, 0);
}

function updatePaymentButton() {
    const btn = document.getElementById('proceed-to-payment');
    const hasSelection = Object.values(state.selected).some(v => v !== null);
    const withinBudget = calculateTotal() <= state.budget;
    btn.disabled = !(hasSelection && withinBudget);
}

function renderServices() {
    ['buses', 'hotels', 'guides'].forEach(serviceType => {
        const type = serviceType.slice(0, -1);
        const container = document.getElementById(serviceType);
        container.innerHTML = services[serviceType]
            .map(item => createCard(item, type, state.selected[type] === item.id))
            .join('');
    });
}

function validateAllocation() {
    const hotel = parseInt(document.getElementById('hotel-allocation').value);
    const bus = parseInt(document.getElementById('bus-allocation').value);
    const guide = parseInt(document.getElementById('guide-allocation').value);
    const total = hotel + bus + guide;
    document.getElementById('total-percent').textContent = `${total}%`;
    const warning = document.getElementById('allocation-warning');

    if (total !== 100) {
        document.getElementById('total-percent').classList.add('error');
        warning.classList.remove('hidden');
        return false;
    }

    document.getElementById('total-percent').classList.remove('error');
    warning.classList.add('hidden');

    budgetLimits.hotel = hotel / 100;
    budgetLimits.bus = bus / 100;
    budgetLimits.guide = guide / 100;

    document.getElementById('hotel-percent').textContent = `${hotel}%`;
    document.getElementById('bus-percent').textContent = `${bus}%`;
    document.getElementById('guide-percent').textContent = `${guide}%`;

    validateSelections();
    updateBudgetDisplay();
    renderServices();
    return true;
}

function validateSelections() {
    Object.entries(state.selected).forEach(([type, id]) => {
        if (!id) return;
        const item = services[typeMap[type]].find(i => i.id === id);
        if (item && item.price > state.budget * budgetLimits[type]) {
            state.selected[type] = null;
            state.bookings[type] = { date: '', time: '' };
            document.getElementById(`${type}-date`).value = '';
            document.getElementById(`${type}-time`).value = '';
        }
    });
}

// Event Listeners
document.getElementById('budget').addEventListener('input', e => {
    state.budget = +e.target.value;
    validateSelections();
    updateBudgetDisplay();
    renderServices();
});

['hotel', 'bus', 'guide'].forEach(type => {
    document.getElementById(`${type}-allocation`).addEventListener('input', e => {
        document.getElementById(`${type}-percent`).textContent = `${e.target.value}%`;
        validateAllocation();
    });

    document.getElementById(`${type}-date`).addEventListener('change', e => {
        state.bookings[type].date = e.target.value;
    });

    document.getElementById(`${type}-time`).addEventListener('change', e => {
        state.bookings[type].time = e.target.value;
    });
});

document.getElementById('source-location').addEventListener('input', e => {
    state.locations.source = e.target.value;
});

document.getElementById('destination-location').addEventListener('input', e => {
    state.locations.destination = e.target.value;
});

document.getElementById('proceed-to-payment').addEventListener('click', () => {
    sessionStorage.setItem('source-location', state.locations.source);
    sessionStorage.setItem('destination-location', state.locations.destination);
    sessionStorage.setItem('total-cost', calculateTotal().toString());
    sessionStorage.setItem('selected-services', JSON.stringify(state.selected));
    window.location.href = 'payment.html';
});

document.addEventListener('click', e => {
    if (e.target.classList.contains('select-btn')) {
        const card = e.target.closest('.card');
        const id = +card.dataset.id;
        const type = card.dataset.type;
        const item = services[typeMap[type]].find(item => item.id === id);

        if (state.selected[type] === id) {
            state.selected[type] = null;
            state.bookings[type] = { date: '', time: '' };
            document.getElementById(`${type}-date`).value = '';
            document.getElementById(`${type}-time`).value = '';
        } else if (item.price <= state.budget * budgetLimits[type]) {
            state.selected[type] = id;
        }

        renderServices();
        updateBudgetDisplay();
    }
});

// Set today's date as min date
const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = today;
});

// Initial render
renderServices();
updateBudgetDisplay();
