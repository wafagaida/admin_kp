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
            <td><img src='http://127.0.0.1:8000/api/image/${post.image}' style="max-width: 100px; max-height: 100px;"></td>
            <td>${post.title}</td>
            <td>${post.content}</td>
            <td>
                <button type="button" class="btn btn-success btn-icon-split btn-sm" data-toggle="modal" data-target="#editModal" onclick="prepareEditData(${post.id})" data-id="${post.id}">
                    <span class="icon text-white">
                        <i class="fas fa-edit"></i>
                    </span>
                </button>        
        
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
    fetch('http://127.0.0.1:8000/api/news')
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

    fetch("http://127.0.0.1:8000/api/news", {
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

function prepareEditData(id) {
    fetch(`http://127.0.0.1:8000/api/news/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data) {
                const news = data.data;

                // Mengisi formulir edit dengan data yang sesuai
                document.getElementById('title').value = news.title;
                document.getElementById('content').value = news.content;

                // Mengatur gambar saat ini
                // const currentImage = document.getElementById('currentImage');
                // currentImage.src = `http://127.0.0.1:8000/api/image/${news.image}`;

                // Menambahkan ID sebagai atribut data-id ke tombol "Edit" pada modal
                const editButton = document.getElementById('editDataButton');
                editButton.setAttribute('data-id', id);
            }
        })
        .catch(error => {
            console.error('Error fetching data for edit:', error);
        });
}


function editData() {
    const editForm = document.getElementById('editForm');
    const formData = new FormData(editForm);

    const editButton = document.getElementById('editDataButton');
    const id = editButton.getAttribute('data-id');

    fetch(`http://127.0.0.1:8000/api/news/${id}`, {
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

function deleteData(id) {
    const confirmation = confirm("Apakah anda yakin ingin menghapus data ini?");

    if (confirmation) {
        fetch(`http://127.0.0.1:8000/api/news/${id}`, {
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