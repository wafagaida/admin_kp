const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', function () {
    if (token) {
        console.log('Berhasil Login');
        // fetchUserData(token);
    } else {
        window.location.href = 'login.html';
    }
});

function logout() {
    const url = 'https://api.smkpsukaraja.sch.id/api/logout';

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

// function fetchUserData(token) {
//     const url = 'https://api.smkpsukaraja.sch.id/api/posts'; // Replace with the correct API endpoint for user data

//     fetch(url, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//         },
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.url}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log(data);
//             if (data.success === true) {
//                 const userNameElement = document.getElementById('namaUser')
//                 userNameElement.textContent = data.nama;
//             } else {
//                 console.error("Error menampilkan data:", error);
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching user data:", error);
//         });
// }
