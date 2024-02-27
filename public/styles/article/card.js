function formatCardNumber(value) {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value) {
    const monthYear = value.replace(/\D/g, '').match(/(\d{1,2})(\d{0,2})/);
    return monthYear ? monthYear[1] + (monthYear[2] ? '/' + monthYear[2] : '') : '';
}

function validateInput(input) {
    const cardNumberPattern = /^\d{4} \d{4} \d{4} \d{4}$/;
    const cardExpiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cardCVCPattern = /^\d{3}$/;

    if (input.id === "cardNumber") {
        return cardNumberPattern.test(input.value);
    } else if (input.id === "cardExpiry") {
        return cardExpiryPattern.test(input.value);
    } else if (input.id === "cardCVC") {
        return cardCVCPattern.test(input.value);
    }
    return false;
}

function updateValidation() {
    let isValid = true;
    document.querySelectorAll("#paymentForm input").forEach(function(input) {
        const isInputValid = validateInput(input);
        input.classList.toggle("error", !isInputValid);
        isValid &= isInputValid;
    });
    document.getElementById("payment-button").disabled = !isValid;
}

document.getElementById("cardNumber").addEventListener("input", function(e) {
    e.target.value = formatCardNumber(e.target.value);
    updateValidation();
});

document.getElementById("cardExpiry").addEventListener("input", function(e) {
    e.target.value = formatExpiry(e.target.value);
    updateValidation();
});

document.getElementById("cardCVC").addEventListener("input", function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    updateValidation();
});

document.querySelectorAll("#paymentForm input").forEach(function(input) {
    input.addEventListener("input", updateValidation);
});

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}