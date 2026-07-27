
const otpInputs = document.querySelectorAll('.otp-input');
const hiddenOTP = document.getElementById('otpCode');

otpInputs.forEach((input,index) => {

    input.addEventListener('input',function(){

        this.value = this.value.replace(/[^0-9]/g,'');

        if(this.value && index < otpInputs.length - 1){
            otpInputs[index + 1].focus();
        }

        updateOTP();

    });

    input.addEventListener('keydown',function(e){

        if(e.key === 'Backspace' && !this.value && index > 0){
            otpInputs[index - 1].focus();
        }

    });

});

function updateOTP(){

    let code = '';

    otpInputs.forEach(input=>{
        code += input.value;
    });

    hiddenOTP.value = code;

}

let timeLeft = 60;

const timer = document.getElementById('timer');
const resendBtn = document.getElementById('resendBtn');

const countdown = setInterval(()=>{

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timer.innerHTML =
        `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

    if(timeLeft <= 0){

        clearInterval(countdown);

        timer.innerHTML = "00:00";

        resendBtn.style.display = "inline-block";

    }

    timeLeft--;

},1000);

resendBtn.addEventListener('click',()=>{

    alert('OTP ថ្មីត្រូវបានផ្ញើរហើយ');

    otpInputs.forEach(input=>{
        input.value='';
    });

    otpInputs[0].focus();

    resendBtn.style.display='none';

    timeLeft = 60;

    startTimer();

});

function startTimer(){

    const interval = setInterval(()=>{

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        timer.innerHTML =
            `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

        if(timeLeft <= 0){

            clearInterval(interval);

            timer.innerHTML = "00:00";

            resendBtn.style.display = "inline-block";

        }

        timeLeft--;

    },1000);

}
