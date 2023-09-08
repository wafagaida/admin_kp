// // Mendapatkan token dari localStorage
// const token = localStorage.getItem('token');

// // Buat objek header HTTP dengan token
// const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`, // Menggunakan Bearer token jika sesuai dengan standar otentikasi
// };

// // Kemudian Anda bisa menggunakan objek header ini dalam permintaan HTTP Anda, contoh:
// fetch('https://api.smkpsukaraja.sch.id/api/posts', {
//     method: 'GET',
//     headers: headers,
// })
// .then(response => {
//     // Lakukan sesuatu dengan respons dari permintaan
// })
// .catch(error => {
//     console.error('Terjadi kesalahan:', error);
// });

document.addEventListener('DOMContentLoaded', function () {
    // Cek apakah pengguna sudah login (token ada di localStorage)
    const token = localStorage.getItem('token');

    if (token) {
        console.log('Berhasil Login')
        // Pengguna sudah login, Anda dapat melakukan tindakan yang sesuai di sini.
        // Misalnya, menampilkan pesan selamat datang atau mengambil data pengguna.
        // Anda juga dapat mengirim token ke server untuk verifikasi sesi.

        // Contoh: Menampilkan pesan selamat datang
        // const welcomeMessage = document.getElementById('welcomeMessage');
        // welcomeMessage.textContent = 'Selamat datang!';

        // Anda juga dapat menambahkan tombol logout dan menghapus sesi saat pengguna logout.
        // const logoutButton = document.getElementById('logoutButton');
        // logoutButton.addEventListener('click', function () {
            // logout();
        // });
    } else {
        // Token tidak ada, pengguna belum login. Redirect ke halaman login.
        window.location.href = 'login.html';
    }
});

// Menghapus token atau informasi sesi
function logout() {
    const url = 'https://api.smkpsukaraja.sch.id/api/logout';
    const token = localStorage.getItem('token');

    try {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            // body: JSON.stringify({ username, password }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.url}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success === true) {
                    localStorage.removeItem('token');
                    $('#successMessage').modal('show');

                    setTimeout(() => {
                        window.location.href = 'login.html';
                        $('#successMessage').modal('hide');
                    }, 1200);
                } else {
                    $('#errorMessage').modal('show');

                    setTimeout(() => {
                        $('#errorMessage').modal('hide');
                    }, 3000);
                }
            })
            .catch(error => {
                console.error("Error logout data:", error);
                $('#errorMessage').modal('show');

                setTimeout(() => {
                    $('#errorMessage').modal('hide');
                }, 3000);
            });
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        alert('Terjadi kesalahan saat melakukan logout.');
    }
}
