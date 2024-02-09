document.addEventListener('DOMContentLoaded', contactStuff);

function contactStuff() {
    handleDeleteButtons();                            // Handle row deletion
    updateTimers();                                   // Update all timers
    setInterval(updateTimers, 1000);                 // Refresh timers every second
}

function handleDeleteButtons() {
    const buttons = document.querySelectorAll('.delete-button'); // Get all delete buttons
    
    buttons.forEach(btn => {                         // Loop through each button
        btn.addEventListener('click', removeRow);    // Assign click handler
    });
}

function removeRow(event) {
    event.preventDefault(); 
    const contactId = event.target.dataset.rowId.replace('row-', ''); // get the id
    console.log(contactId)

    
    fetch('/api/contact', {   // do the delete call
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id: contactId })
    })
    .then(response => {
        if (response.ok) {
            //if it works then delete the row
            event.target.closest('tr').remove();
        } else {
            // if it doesnt then error
            console.error('Deletion failed:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateTimers() {
    const dateElements = document.querySelectorAll('td[data-date]'); // Get all date cells
    
    dateElements.forEach(elem => {
        const dateStr = elem.dataset.date;           // Get the date string
        const targetDate = new Date(dateStr);        // Convert to Date object
        const currentTime = new Date();              // Get current time

        if (!isNaN(targetDate)) {                    // If date is valid
            const difference = targetDate - currentTime; // Calculate difference
            const adjacentCell = elem.nextElementSibling; 
            adjacentCell.textContent = getTimeDifferenceString(difference); 
        }
    });
}

function getTimeDifferenceString(milliseconds) {     // Convert time difference to string format
    if (milliseconds < 0) {                         // If date is in the past
        return "PAST";                              
    }
    
    const oneSecond = 1000;                          // Milliseconds in a second
    const oneMinute = oneSecond * 60;               // Milliseconds in a minute
    const oneHour = oneMinute * 60;                 // Milliseconds in an hour
    const oneDay = oneHour * 24;                    // Milliseconds in a day
    
    const days = Math.floor(milliseconds / oneDay);  
    milliseconds %= oneDay;                         

    const hours = Math.floor(milliseconds / oneHour); 
    milliseconds %= oneHour;                        

    const mins = Math.floor(milliseconds / oneMinute); 
    milliseconds %= oneMinute;                     

    const secs = Math.floor(milliseconds / oneSecond); 

    return `${days} days, ${hours} hours, ${mins} minutes, ${secs} seconds left`; 
}
