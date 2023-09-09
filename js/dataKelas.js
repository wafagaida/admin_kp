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
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function createTableRow(post, index) {
    return `
        <tr>
            <td>${index + 1}</td>
            <td>${post.kd_kelas}</td>
            <td>${post.nama_kelas}</td>
            <td>${post.jurusan}</td>
            <td>${post.tingkat}</td>
            <td>
                <button type="button" class="btn btn-danger btn-icon-split btn-sm" onclick="deleteData('${post.id}')">
                    <span class="icon text-white">
                        <i class="fas fa-trash"></i>
                    </span>
                </button>
            </td>
        </tr>
    `;
}

function getPosts() {
    showLoading();
    fetch('https://api.smkpsukaraja.sch.id/api/kelas')
        .then(response => response.json())
        .then(data => {
            hideLoading();
            console.log(data);

            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';

            data.data.forEach((post, index) => {
                const row = createTableRow(post, index);
                tableBody.innerHTML += row;
            });

        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}


function addData() {
    const addForm = document.getElementById('addForm');
    const formData = new FormData(addForm);
    const modalBody = document.querySelector('.modal-body');

    fetch("https://api.smkpsukaraja.sch.id/api/kelas", {
        method: "POST",
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.url}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success === true) {
                console.log('Success:', data);

                $('#successMessage-add').modal('show');

                getPosts();

                setTimeout(() => {
                    $('#addModal').modal('hide');
                    $('#successMessage-add').modal('hide');
                }, 1200);
            } else {
                console.error("Gagal menambah data.");

                $('#errorMessage-add').modal('show');

                setTimeout(() => {
                    $('#errorMessage-add').modal('hide');
                }, 1200);
            }
        })
        .catch(error => {
            console.error("Error adding data:", error);

            $('#errorMessage-add').modal('show');

            setTimeout(() => {
                $('#errorMessage-add').modal('hide');
            }, 1200);
        });
}

function deleteData(id) {
    const confirmation = confirm("Apakah anda yakin ingin menghapus data ini?");
    const modalBody = document.querySelector('.container-fluid');

    if (confirmation) {
        fetch(`https://api.smkpsukaraja.sch.id/api/kelas/${id}`, {
            method: "DELETE",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.url}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success === true) {
                    getPosts();

                    $('#successMessage-delete').modal('show');

                    setTimeout(() => {
                        $('#successMessage-delete').modal('hide');
                    }, 1200);
                } else {
                    $('#errorMessage-delete').modal('show');

                    setTimeout(() => {
                        $('#errorMessage-delete').modal('hide');
                    }, 1200);
                }
            })
            .catch(error => {
                console.error("Error deleting data:", error);
                $('#errorMessage-delete').modal('show');

                setTimeout(() => {
                    $('#errorMessage-delete').modal('hide');
                }, 1200);
            });
    }
}