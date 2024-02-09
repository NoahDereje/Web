document.addEventListener("DOMContentLoaded", function() {
    function calculatePrice() {
        let dropdownValue = document.getElementById("dropdown").value;
        let checkboxValue = document.getElementById("checkbox").checked;
        let resultElement = document.getElementById("calculationResult");
        let basePrice;

        switch (dropdownValue) {
            case "Phone":
                basePrice = 5;
                break;
            case "Walk-in":
                basePrice = 10;
                break;
            case "Online":
                basePrice = 15;
                break;
            default:
                basePrice = 0;
        }

        if (checkboxValue) {
            basePrice *= 0.85; 
        }

        resultElement.innerText = "That will cost $" + basePrice.toFixed(2);
    }

    
    calculatePrice();

  
    document.getElementById("dropdown").addEventListener("change", calculatePrice);
    document.getElementById("checkbox").addEventListener("change", calculatePrice);
});
