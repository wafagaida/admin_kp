// Mendapatkan token dari localStorage
const token = localStorage.getItem('token');

// Buat objek header HTTP dengan token
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Menggunakan Bearer token jika sesuai dengan standar otentikasi
};

// Kemudian Anda bisa menggunakan objek header ini dalam permintaan HTTP Anda, contoh:
fetch('http://127.0.0.1:8000/api/posts', {
    method: 'GET',
    headers: headers,
})
.then(response => {
    // Lakukan sesuatu dengan respons dari permintaan
})
.catch(error => {
    console.error('Terjadi kesalahan:', error);
});


// Menghapus token atau informasi sesi
function logout() {
    // Hapus token dari localStorage atau sessionStorage
    // localStorage.removeItem('token'); // Ubah 'token' sesuai dengan nama token yang Anda gunakan
    // atau
    // sessionStorage.removeItem('token');

    // Arahkan pengguna ke halaman login
    // window.location.href = 'login.html'; // Ganti 'login.html' sesuai dengan halaman login Anda
    const url = 'http://127.0.0.1:8000/api/logout';

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
