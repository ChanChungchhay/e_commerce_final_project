document.querySelectorAll('.toggle-password').forEach(button => {

    button.addEventListener('click', () => {

        const target = document.getElementById(button.dataset.target);
        const icon = button.querySelector('i');

        if (target.type === 'password') {
            target.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            target.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }

    });

});