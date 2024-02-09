function fetchSale() {
    fetch('/api/sale')
      .then(response => response.json())
      .then(data => {
        const banner = document.getElementById('sales-banner');
        const message = document.getElementById('sales-message');
        if (data.active && data.message) {
          message.textContent = data.message;
          banner.style.display = 'block';
        } else {
          banner.style.display = 'none';
        }
      })
      .catch(error => console.error('Error fetching sale:', error));
  }
  

  setInterval(fetchSale, 1000);

  
  function setSale() {
    const message = document.getElementById('sale-message-input').value;
    fetch('/api/sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    })
    .then(response => {
      if (response.ok) {
        alert('Sale set successfully');
        document.getElementById('sale-message-input').value = ''; 
      } else {
        alert('Failed to set sale');
      }
    })
    .catch(error => console.error('Error setting sale:', error));
  }
  
  function deleteSale() {
    fetch('/api/sale', {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        alert('Sale deleted successfully');
      } else {
        alert('Failed to delete sale');
      }
    })
    .catch(error => console.error('Error deleting sale:', error));
  }
  


function toggle_style() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.getElementById("pageMode").setAttribute("href", "/css/main.css");
        localStorage.setItem('theme', 'light'); 
    } else {
        document.getElementById("pageMode").setAttribute("href", "/css/main.dark.css");
        localStorage.setItem('theme', 'dark'); 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.getElementById("pageMode").setAttribute("href", "/css/main.dark.css");
    } else {
        document.getElementById("pageMode").setAttribute("href", "/css/main.css");
    }
    document.getElementById('themeToggleBtn').addEventListener('click', toggle_style);
});
