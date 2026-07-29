
        // ===== change profile img =======
        // const profile = document.getElementById("profile");
        // const fileInput = document.getElementById("fileInput");
        // fileInput.addEventListener("change", function () {
        //     const file = this.files[0];
        //     if (file) {
        //         const reader = new FileReader();
        //         reader.onload = function (e) {
        //             profile.src = e.target.result;
        //         }
        //         reader.readAsDataURL(file);
        //     }
        // });
    
   
        // ===== active nav-link =====
        // const links = document.querySelectorAll('.nav-link');

        // links.forEach(link => {
        //     link.addEventListener('click', function () {
        //         links.forEach(item => item.classList.remove('active'));
        //         this.classList.add('active');
        //     });
        // });   
   
        // =====delete favo ======
        let cardToDelete = null;
        document.querySelectorAll(".delete").forEach(btn => {
            btn.addEventListener("click", function () {
                cardToDelete = this.closest(".product-card");
            });
        });
        document.getElementById("confirmDelete").addEventListener("click", function () {

            if (cardToDelete) {
                cardToDelete.remove();
            }
            const modal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
            modal.hide();
        });
  
        // =====move all favo to stock====
        const toastTrigger = document.getElementById('movealltostock')
        const toastLiveExample = document.getElementById('liveToast')
        if (toastTrigger) {
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
            toastTrigger.addEventListener('click', () => {
                toastBootstrap.show()
            })
        }
   
        // const toast = document.getElementById('movetostock')
        // const toastLiveExample1 = document.getElementById('liveToast-1')
        // if (toast) {
        //   const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample1)
        //   toast.addEventListener('click', () => {
        //     toastBootstrap.show()
        //   })
        // }
   
        // =====move all favo to stock====
        const toastLiveExample1 = document.getElementById('liveToast-1')
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample1)
        document.querySelectorAll('.movetostock').forEach(function (btn) {
            btn.addEventListener('click', () => {
                toastBootstrap.show()
            })
        })
    