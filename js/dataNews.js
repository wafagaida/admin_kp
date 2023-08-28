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
                <button type="button" id="data-id" class="btn btn-success btn-icon-split btn-sm" data-toggle="modal" data-target="#editModal" data-id='${post.id}'>
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

    const id = document.getElementById('data-id').getAttribute('data-id');

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

function deleteData(id) {
    const confirmation = confirm("Apakah anda yakin ingin menghapus data ini?");
    const modalBody = document.querySelector('.container-fluid');

    if (confirmation) {
        fetch(`http://127.0.0.1:8000/api/news/${id}`, {
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