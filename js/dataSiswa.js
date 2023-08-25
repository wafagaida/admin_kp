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
                <button type="button" class="btn btn-success btn-icon-split btn-sm" data-toggle="modal" data-target="#editModal" onclick="openEditModal('${post.nis}')">
                    <span class="icon text-white">
                        <i class="fas fa-edit"></i>
                    </span>
                </button>
                <a href="#" class="btn btn-danger btn-icon-split btn-sm" onclick="deleteData('${post.nis}')">
                    <span class="icon text-white">
                        <i class="fas fa-trash"></i>
                    </span>
                </a>
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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success === true) {
                // Tampilkan pesan sukses
                const successMessage = document.createElement('div');
                successMessage.classList.add('alert', 'alert-success');
                successMessage.textContent = "Data berhasil ditambahkan!";
                modalBody.appendChild(successMessage);

                // Refresh the data
                getPosts();

                // Hide the modal after a short delay
                setTimeout(() => {
                    $('#addModal').modal('hide');
                }, 1000);

                // Remove the success message after a delay
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            } else {
                console.error("Failed to add data.");
            }
        })
        .catch(error => {
            console.error("Error adding data:", error);
        });
}

function openEditModal(nis) {
    fetch(`http://127.0.0.1:8000/api/posts/${nis}`)
        .then(response => response.json())
        .then(data => {
            if (data.success === true) {
                const editModal = document.getElementById('editModal');
                fillEditForm(data.data); // Fill the edit form with data
                $(editModal).modal('show'); // Show the edit modal
            } else {
                console.error("Failed to fetch data for edit.");
            }
        })
        .catch(error => {
            console.error("Error fetching data for edit:", error);
        });
}

function fillEditForm(data) {
    const editForm = document.getElementById('editForm');
    // Fill the form fields with data properties
    document.getElementById('nis').value = data.nis;
    document.getElementById('nama').value = data.nama;
    document.getElementById('username').value = data.username;
    // ... and so on for other fields
}

function editData() {
    const editForm = document.getElementById('editForm');
    const formData = new FormData(editForm);

    fetch("http://127.0.0.1:8000/api/posts/update", {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success === true) {
                const editModal = document.getElementById('editModal');
                $(editModal).modal('hide'); // Close the edit modal
                getPosts(); // Refresh the data

                // Display update success message, similar to the add process
                // ...

            } else {
                console.error("Failed to update data.");
            }
        })
        .catch(error => {
            console.error("Error updating data:", error);
        });
}

function deleteData(nis) {
    const confirmation = confirm("Apakah anda yakin ingin menghapus data ini?");
    if (confirmation) {
        fetch(`http://127.0.0.1:8000/api/posts/${nis}`, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    // Refresh the data after successful deletion
                    getPosts();

                    // Display delete success message
                    const deleteMessage = document.createElement('div');
                    deleteMessage.classList.add('alert', 'alert-success');
                    deleteMessage.textContent = "Data berhasil dihapus!";
                    document.body.appendChild(deleteMessage);

                    // Remove the message after a delay
                    setTimeout(() => {
                        deleteMessage.remove();
                    }, 3000); // Remove after 3 seconds
                } else {
                    // Display delete failure message
                    const deleteMessage = document.createElement('div');
                    deleteMessage.classList.add('alert', 'alert-danger');
                    deleteMessage.textContent = "Gagal menghapus data.";
                    document.body.appendChild(deleteMessage);

                    // Remove the message after a delay
                    setTimeout(() => {
                        deleteMessage.remove();
                    }, 3000); // Remove after 3 seconds
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

// function updateData() {
//     if (currentEditingNis !== null) {
//         const editForm = document.getElementById('editForm');
//         const updatedData = {
//             nis: editForm.nis.value,
//             nama: editForm.nama.value,
//             jurusan: editForm.jurusan.value,
//             tingkat: editForm.tingkat.value,
//             jenis_kelamin: editForm.jenis_kelamin.value,
//             nik: editForm.nik.value,
//             tanggal_lahir: editForm.tanggal_lahir.value,
//             alamat: editForm.alamat.value,
//             no_tlp: editForm.no_tlp.value
//         };

//         fetch(`http://127.0.0.1:8000/api/posts/${currentEditingNis}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(updatedData),
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 // Proses hasil respon dari API setelah pembaruan berhasil
//                 console.log(data);
//                 // Tutup modal
//                 $('#editModal').modal('hide');
//                 // Lakukan pembaruan tampilan sesuai dengan respons dari API
//             });
//     }
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
