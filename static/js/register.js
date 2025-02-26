
document.addEventListener("DOMContentLoaded", function () {

    // Email verification button
    document.getElementById('sendVerification').addEventListener('click', function () {
        const email = document.getElementById('email').value;
        if (email) {
            Swal.fire('Verification code sent to ' + email);
            startCountdown();
        } else {
            Swal.fire('Please enter an email address');
        }
    });

    document.getElementById('registrationForm').addEventListener('submit', function (e) {
        if (!checkVelue()) {
            Swal.fire('Please fill in all fields');
            e.preventDefault();
        }
        e.preventDefault();
        Swal.alert('Registration successful!');
        // Add your form submission logic here
    });

    const confirmPasswordInput = document.getElementById('confirmPassword');
    confirmPasswordInput.addEventListener('input', checkPassword);
    confirmPasswordInput.addEventListener('blur', checkPassword); // Validate on leaving the input

});

function checkPassword() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity('Passwords do not match');
        confirmPasswordInput.reportValidity(); // Show validation message immediately
    } else {
        confirmPasswordInput.setCustomValidity('');
    }
}

function startCountdown() {
    const sendButton = document.getElementById("sendVerification");
    const countdownSpan = document.getElementById("countdown");
    sendButton.className = "btn btn-secondary";
    let countdown = 60;
    sendButton.disabled = true;
    countdownSpan.textContent = `resend after ${countdown} seconds`;

    const interval = setInterval(() => {
        countdown -= 1;
        if (countdown > 0) {
            countdownSpan.textContent = `resend after ${countdown} seconds`;
        } else {
            clearInterval(interval);
            sendButton.disabled = false;
            countdownSpan.textContent = "";
            sendButton.className = "btn btn-primary";
        }
    }, 1000);
}


let currentStep = 1;

function updateProgress() {
    const progress = ((currentStep - 1) / 2) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;

    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function nextStep(step) {
    // Add validation here
    document.getElementById(`step${step}`).classList.remove('active');
    document.getElementById(`step${step + 1}`).classList.add('active');
    currentStep = step + 1;
    updateProgress();

    if (currentStep === 3) {
        updateSummary();
    }
}

function prevStep(step) {
    document.getElementById(`step${step}`).classList.remove('active');
    document.getElementById(`step${step - 1}`).classList.add('active');
    currentStep = step - 1;
    updateProgress();
}

function updateSummary() {
    const summary = document.getElementById('summary');
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    let riskProfile = '';
    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        riskProfile += `${radio.name}: ${radio.value}\n`;
    });

    summary.innerHTML = `
    <p><strong>Username:</strong> ${username}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Risk Profile:</strong></p>
    <pre>${riskProfile}</pre>
`;
}

function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    if (input.type === "password") {
        input.type = "text";
        button.textContent = "Hide";
        button.className = "btn btn-secondary";
    } else {
        input.type = "password";
        button.textContent = "Show";
        button.className = "btn btn-primary";
    }
}

function checkVelue() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const email = document.getElementById('email');
    const verificationCode = document.getElementById('verificationCode');
    if (username.value && password.value && confirmPassword.value && email.value && verificationCode.value) {
        document.getElementById('submit').disabled = false;
        return true;
    } else {
        document.getElementById('submit').disabled = true;
        return false;
    }
}