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
            <td>${post.nis}</td>
            <td>${post.nama}</td>
            <td>${post.jurusan}</td>
            <td>${post.tingkat}</td>
            <td>${post.jenis_kelamin}</td>
            <td>${post.nik ? post.nik : '-'}</td>
            <td>${post.tanggal_lahir ? post.tanggal_lahir : "-"}</td>
            <td>${post.alamat ? post.alamat : '-'}</td>
            <td>${post.no_tlp ? post.no_tlp : '-'}</td>
            <td>
                <button type="button" id="editButton" class="btn btn-success btn-icon-split btn-sm" data-toggle="modal" data-target="#editModal">
                    <span class="icon text-white">
                        <i class="fas fa-edit"></i>
                    </span>
                </button>
                <button type="button" class="btn btn-danger btn-icon-split btn-sm" onclick="deleteData('${post.nis}')">
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
    fetch('http://127.0.0.1:8000/api/posts')
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

    fetch("http://127.0.0.1:8000/api/posts", {
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

                const successMessage = document.createElement('div');
                successMessage.classList.add('alert', 'alert-success');
                successMessage.textContent = "Data berhasil ditambahkan!";
                modalBody.appendChild(successMessage);

                getPosts();

                setTimeout(() => {
                    $('#addModal').modal('hide');
                    successMessage.remove();
                }, 1200);
            } else {
                console.error("Gagal menambah data.");

                const successMessage = document.createElement('div');
                successMessage.classList.add('alert', 'alert-danger');
                successMessage.textContent = "Data gagal ditambahkan!";
                modalBody.appendChild(successMessage);

                setTimeout(() => {
                    successMessage.remove();
                }, 1200);
            }
        })
        .catch(error => {
            console.error("Error adding data:", error);

            // const errorMessage = error.message || "Error menambah data!";
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('alert', 'alert-danger');
            errorMessage.textContent = "Error menambah data!";
            modalBody.appendChild(errorMessage);

            setTimeout(() => {
                errorMessage.remove();
            }, 1200);
        });
}

function editData() {

    const editForm = document.getElementById('editForm');
    const formData = new FormData(editForm);
    const modalBody = document.querySelector('.modal-body');

    const nis = formData.get('nis');

    fetch(`http://127.0.0.1:8000/api/posts/${nis}`, {
        method: 'PUT',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json'
        }
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

                const successMessage = document.createElement('div');
                successMessage.classList.add('alert', 'alert-success');
                successMessage.textContent = "Data berhasil diubah!";
                modalBody.appendChild(successMessage);

                getPosts();

                setTimeout(() => {
                    $('#editModal').modal('hide');
                    successMessage.remove();
                }, 1200);

            } else {
                console.error("Gagal mengedit data.");

                const successMessage = document.createElement('div');
                successMessage.classList.add('alert', 'alert-danger');
                successMessage.textContent = "Data gagal ditambahkan!";
                modalBody.appendChild(successMessage);

                setTimeout(() => {
                    successMessage.remove();
                }, 1200);
            }
        })
        .catch(error => {
            console.error('Error editing data:', error);

            const errorMessage = document.createElement('div');
            errorMessage.classList.add('alert', 'alert-danger');
            errorMessage.textContent = "Error mengedit data!";
            modalBody.appendChild(errorMessage);

            setTimeout(() => {
                errorMessage.remove();
            }, 1200);
        });
}


// function openEditModal(nis) {
//     fetch(`http://127.0.0.1:8000/api/posts/${nis}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.success === true) {
//                 const editModal = document.getElementById('editModal');
//                 fillEditForm(data.data); // Memanggil fungsi fillEditForm dengan data yang diterima
//                 $(editModal).modal('show'); // Menampilkan modal edit
//             } else {
//                 console.error("Failed to fetch data for edit.");
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching data for edit:", error);
//         });
// }

// function fillEditForm(data) {
//     const editForm = document.getElementById('editForm');
//     document.getElementById('nis').value = data.nis;
//     document.getElementById('nama').value = data.nama;
//     document.getElementById('jenis_kelamin').value = data.jenis_kelamin;
//     document.getElementById('tingkat').value = data.tingkat;
//     document.getElementById('jurusan').value = data.jurusan;
//     document.getElementById('kd_kelas').value = data.kd_kelas;
//     document.getElementById('tahun_masuk').value = data.tahun_masuk;
//     document.getElementById('nik').value = data.nik;
//     document.getElementById('tanggal_lahir').value = data.tanggal_lahir;
//     document.getElementById('alamat').value = data.alamat;
//     document.getElementById('no_tlp').value = data.no_tlp;
//     document.getElementById('username').value = data.username;
//     document.getElementById('password').value = data.password;
// }

// function editData() {
//     const editForm = document.getElementById('editForm');
//     const formData = new FormData(editForm);

//     fetch(`http://127.0.0.1:8000/api/posts` ,{
//         method: "POST",
//         body: formData,
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success === true) {
//                 const editModal = document.getElementById('editModal');
//                 $(editModal).modal('hide'); // Close the edit modal
//                 getPosts(); // Refresh the data

//                 // Display update success message, similar to the add process
//                 // ...

//             } else {
//                 console.error("Failed to update data.");
//             }
//         })
//         .catch(error => {
//             console.error("Error updating data:", error);
//         });
// }

// function populateEditForm(data) {
//     document.getElementById('nis').value = data.nis;
//     document.getElementById('nama').value = data.nama;
//     document.getElementById('jenis_kelamin').value = data.jenis_kelamin;
//     document.getElementById('tingkat').value = data.tingkat;
//     document.getElementById('jurusan').value = data.jurusan;
//     document.getElementById('kd_kelas').value = data.kd_kelas;
//     document.getElementById('tahun_masuk').value = data.tahun_masuk;
//     document.getElementById('nik').value = data.nik;
//     document.getElementById('tanggal_lahir').value = data.tanggal_lahir;
//     document.getElementById('alamat').value = data.alamat;
//     document.getElementById('no_tlp').value = data.no_tlp;
//     document.getElementById('username').value = data.username;
//     document.getElementById('password').value = data.password;
// }

// function fetchDataForEdit(nis) {
//     fetch('http://127.0.0.1:8000/api/posts/' + nis) // Replace with your API endpoint
//         .then(response => response.json())
//         .then(data => {
//             if (data.success === true) {
//                 populateEditForm(data);
//                 $('#editModal').modal('show');
//             } else {
//                 console.error("Failed to edit data.");
//             }
//         })
//         .catch(error => {
//             console.error("Error edit data:", error);
//         });
// }

// function editData(nis) {
//     const editedData = {
//         nis: document.getElementById('nis').value,
//         nama: document.getElementById('nama').value,
//         jenis_kelamin: document.getElementById('jenis_kelamin').value,
//         tingkat: document.getElementById('tingkat').value,
//         jurusan: document.getElementById('jurusan').value,
//         kd_kelas: document.getElementById('kd_kelas').value,
//         tahun_masuk: document.getElementById('tahun_masuk').value,
//         nik: document.getElementById('nik').value,
//         tanggal_lahir: document.getElementById('tanggal_lahir').value,
//         alamat: document.getElementById('alamat').value,
//         no_tlp: document.getElementById('no_tlp').value,
//         username: document.getElementById('username').value,
//         password: document.getElementById('password').value
//     };

//     fetch(`http://127.0.0.1:8000/api/posts/${nis}`, { // Replace with your API endpoint for updating
//         method: 'PUT',
//         body: JSON.stringify(editedData),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.success === true) {
//                 // console.log('Data updated successfully:', data);
//                 $('#editModal').modal('hide'); // Hide the modal
//                 getPosts();
//             } else {
//                 console.error("Failed to edit data.");
//             }
//         })
//         .catch(error => {
//             console.error('Error updating data:', error);
//         });
// }

function deleteData(nis) {
    const confirmation = confirm("Apakah anda yakin ingin menghapus data ini?");
    const modalBody = document.querySelector('.container-fluid');

    if (confirmation) {
        fetch(`http://127.0.0.1:8000/api/posts/${nis}`, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    getPosts();

                    const deleteMessage = document.createElement('div');
                    deleteMessage.classList.add('alert', 'alert-success');
                    deleteMessage.textContent = "Data berhasil dihapus!";
                    modalBody.appendChild(deleteMessage);

                    setTimeout(() => {
                        deleteMessage.remove();
                    }, 1200);
                } else {
                    const deleteMessage = document.createElement('div');
                    deleteMessage.classList.add('alert', 'alert-danger');
                    deleteMessage.textContent = "Gagal menghapus data.";
                    modalBody.appendChild(deleteMessage);

                    setTimeout(() => {
                        deleteMessage.remove();
                    }, 1200);
                }
            })
            .catch(error => {
                console.error("Error deleting data:", error);
            });
    }
}



// let currentEditingNis = null;

// function editData(nis) {
//     currentEditingNis = nis;
//     fetch(`http://127.0.0.1:8000/api/posts/${nis}`)
//         .then((res) => res.json())
//         .then((data) => {
//             const editForm = document.getElementById('editForm');

//             // Isi form dengan data yang akan diedit
//             editForm.nis.value = data[0].nis;
//             editForm.nama.value = data[0].nama;
//             editForm.jurusan.value = data[0].jurusan;
//             editForm.tingkat.value = data[0].tingkat;
//             editForm.jenis_kelamin.value = data[0].jenis_kelamin;
//             editForm.nik.value = data[0].nik;
//             editForm.tanggal_lahir.value = data[0].tanggal_lahir;
//             editForm.alamat.value = data[0].alamat;
//             editForm.no_tlp.value = data[0].no_tlp;
//         });
// }

// function editData() {
//     const editForm = document.getElementById('editForm');
//     const formData = new FormData(editForm);

//     const nis = formData.get('nis');

//     fetch(`http://127.0.0.1:8000/api/posts/${nis}`, {
//         method: 'PUT',
//         body: formData, // Menggunakan FormData langsung sebagai body
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.success === true) {
//                 // console.log('Data updated successfully:', data);
//                 $('#editModal').modal('hide'); // Sembunyikan modal
//                 getPosts(); // Perbarui tampilan data
//             } else {
//                 console.error("Failed to edit data.");
//             }
//         })
//         .catch(error => {
//             console.error('Error updating data:', error);
//         });
// }




// function getPosts() {
//     showLoading();
//     // fetch('https://jsonplaceholder.typicode.com/posts')
//     fetch('http://127.0.0.1:8000/api/posts')
//         .then((res) => res.json())
//         .then((data) => {
//             hideLoading();
//             console.log(data);

//             const tableBody = document.getElementById('tableBody');
//             data.forEach((post) => {
//                 const row = createTableRow(post);
//                 tableBody.innerHTML += row;
//             });
//         });
// }
