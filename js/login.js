document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Ganti URL berikut dengan URL backend otentikasi Anda
        const url = 'http://127.0.0.1:8000/api/login';

        try {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.url}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success === true) {
                        if (data.user.level === 'Admin') { 
                            localStorage.setItem('token', data.token);
                            $('#successMessage').modal('show');

                            setTimeout(() => {
                                window.location.href = 'index.html';
                                $('#successMessage').modal('hide');
                            }, 1200);
                        } else {
                            $('#errorMessage').modal('show');

                            setTimeout(() => {
                                $('#errorMessage').modal('hide');
                            }, 3000);
                        }
                    } else {
                        // alert('Login gagal. Cek kembali username dan password Anda.');
                        $('#errorMessage').modal('show');

                        setTimeout(() => {
                            $('#errorMessage').modal('hide');
                        }, 3000);
                    }
                })
                .catch(error => {
                    console.error("Error adding data:", error);
                    $('#errorMessage').modal('show');

                    setTimeout(() => {
                        $('#errorMessage').modal('hide');
                    }, 3000);

                });
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            alert('Terjadi kesalahan saat melakukan login.');
        }
    })
});