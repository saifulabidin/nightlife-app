/* script.js */
const barsList = document.getElementById('bars-list');
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const authIcon = document.getElementById('auth-icon');
const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');

let isAuthenticated = false;
let currentCity = '';

// Check authentication status on page load
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('authenticatedUser'));
  if (user) {
    isAuthenticated = true;
    usernameDisplay.textContent = `I'M, ${user.username}`;
    usernameDisplay.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    authIcon.classList.add('hidden');
  } else {
    isAuthenticated = false;
    usernameDisplay.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    authIcon.classList.remove('hidden');
  }
}

// Handle logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('authenticatedUser');
  checkAuth();
  window.location.reload();
});

// Call checkAuth when page loads
checkAuth();

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) return;
  currentCity = city;
  fetchBars(city);
});

function fetchBars(city) {
  barsList.innerHTML = '<p>Loading bars...</p>';

  // Dummy data; replace with Yelp API call
  setTimeout(() => {
    const dummyBars = [
      { id: 'bar1', name: 'The Tipsy Tavern', going: [] },
      { id: 'bar2', name: 'Night Owl Lounge', going: [] }
    ];
    renderBars(dummyBars);
  }, 500);
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-gray-800 border border-purple-500 text-white px-6 py-3 rounded shadow-lg';
  notification.textContent = message;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function renderBars(bars) {
  barsList.innerHTML = '';
  bars.forEach(bar => {
    const card = document.createElement('div');
    card.className = 'bg-gray-800 border border-gray-700 p-4 rounded-lg flex justify-between items-center hover:border-purple-500';

    const info = document.createElement('div');
    info.className = 'text-lg font-semibold';
    info.textContent = bar.name;

    const action = document.createElement('button');
    action.textContent = isAuthenticated ? 'I\'m Going' : 'Login to RSVP';
    action.className = 'bg-gray-900 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50 border border-purple-500';
    action.disabled = !isAuthenticated;
    action.addEventListener('click', () => {
      if (isAuthenticated) showNotification(`You are going to ${bar.name}`);
      else window.location.href = '/login.html';
    });

    card.appendChild(info);
    card.appendChild(action);
    barsList.appendChild(card);
  });
}
