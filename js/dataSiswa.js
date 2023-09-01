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

function editData() {
    const editForm = document.getElementById('editForm');
    const formData = new FormData(editForm);
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

                $('#successMessage-update').modal('show');

                getPosts();

                setTimeout(() => {
                    $('#editModal').modal('hide');
                    $('#successMessage-update').modal('hide');
                }, 1200);

            } else {
                console.error("Gagal mengedit data.");

                $('#errorMessage-update').modal('show');

                setTimeout(() => {
                    $('#errorMessage-update').modal('hide');
                }, 1200);
            }
        })
        .catch(error => {
            console.error('Error editing data:', error);

            $('#errorMessage-update').modal('show');

            setTimeout(() => {
                $('#errorMessage-update').modal('hide');
            }, 1200);
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
