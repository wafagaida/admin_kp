function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function createTableRow(post) {
    return `
        <tr>
            <td>${post.nis}</td>
            <td>${post.nama}</td>
            <td>${post.username}</td>
            <td>${post.jurusan}</td>
            <td>${post.tingkat}</td>
            <td>${post.jenis_kelamin}</td>
            <td>${post.nik ? post.nik : 'Tidak Ada Data'}</td>
            <td>${post.tanggal_lahir ? post.tanggal_lahir : "Tidak Ada Data"}</td>
            <td>${post.alamat ? post.alamat : 'Tidak Ada Data'}</td>
            <td>${post.no_tlp ? post.no_tlp : 'Tidak Ada Data'}</td>
            <td>
            <button type="button" class="btn btn-success btn-icon-split btn-sm" data-toggle="modal" data-target="#editModal" onclick="editData(${post.id})">
                <span class="icon text-white-50">
                    <i class="fas fa-edit"></i>
                 </span>
                </button>
                <a href="#" class="btn btn-danger btn-icon-split btn-sm" onclick="return confirm('Yakin dihapus?')"><span class="icon text-white-50">
                <i class="fas fa-trash"></i>
                </span>
            </button></a>
            </td>
        </tr>
    `;
}

function getPosts() {
    showLoading();
    fetch('http://127.0.0.1:8000/api/posts')
        .then((res) => res.json())
        .then((data) => {
            hideLoading();
            console.log(data);

            const tableBody = document.getElementById('tableBody');
            const fragment = document.createDocumentFragment();

            data.data.forEach((post) => {
                const row = createTableRow(post);
                const tr = document.createElement('tr');
                tr.innerHTML = row;
                fragment.appendChild(tr);
            });

            tableBody.appendChild(fragment);
        });
}

function addData() {
    const addForm = document.getElementById('addForm');
    const formData = new FormData(addForm);

    fetch('http://127.0.0.1:8000/api/posts', {
        method: 'POST',
        body: formData
    })
    .then((response) => response.json())
    .then((data) => {
        // Refresh the table to display the updated data
        getPosts();

        // Close the modal after adding data
        $('#addModal').modal('hide');
    })
    .catch((error) => {
        console.error('Error adding data:', error);
    });
}


// // Fungsi untuk menambahkan data siswa melalui API
// async function addData() {
//     const nis = document.getElementById('nis').value;
//     const nama = document.getElementById('nama').value;
//     const jurusan = document.getElementById('jurusan').value;
//     const tingkat = document.getElementById('tingkat').value;
//     const jenisKelamin = document.getElementById('jenis_kelamin').value;
//     const nik = document.getElementById('nik').value;
//     const tanggalLahir = document.getElementById('tanggal_lahir').value;
//     const alamat = document.getElementById('alamat').value;
//     const noHp = document.getElementById('no_tlp').value;

//     const data = {
//         nis,
//         nama,
//         jurusan,
//         tingkat,
//         jenis_kelamin: jenisKelamin,
//         nik,
//         tanggal_lahir: tanggalLahir,
//         alamat,
//         no_tlp: noHp
//     };

//     try {
//         const response = await fetch('http://127.0.0.1:8000/api/posts', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });

//         if (response.ok) {
//             // Data berhasil ditambahkan, perbarui tabel
//             getPosts();

//             // Tutup modal tambah data
//             $('#addModal').modal('hide');

//             // Kosongkan input pada modal
//             document.getElementById('nis').value = '';
//             document.getElementById('nama').value = '';
//             document.getElementById('jurusan').value = '';
//             document.getElementById('tingkat').value = '';
//             document.getElementById('jenis_kelamin').value = '';
//             document.getElementById('nik').value = '';
//             document.getElementById('tanggal_lahir').value = '';
//             document.getElementById('alamat').value = '';
//             document.getElementById('no_tlp').value = '';
//         } else {
//             console.error('Failed to add data:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error adding data:', error);
//     }
// }

// function addData() {
//     const addForm = document.getElementById('addForm');
//     const newData = {
//         nis: addForm.nis.value,
//         nama: addForm.nama.value,
//         jurusan: addForm.jurusan.value,
//         tingkat: addForm.tingkat.value,
//         jenis_kelamin: addForm.jenis_kelamin.value,
//         nik: addForm.nik.value,
//         tanggal_lahir: addForm.tanggal_lahir.value,
//         alamat: addForm.alamat.value,
//         no_tlp: addForm.no_tlp.value
//     };

//     fetch('http://127.0.0.1:8000/api/posts', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newData),
//     })
//     .then((res) => res.json())
//     .then((data) => {
//         // Proses hasil respon dari API setelah penambahan berhasil
//         console.log(data);
//         // Tutup modal setelah data berhasil ditambahkan
//         $('#addModal').modal('hide');
//         // Lakukan tindakan setelah data berhasil ditambahkan
//         // Misalnya, reset form atau muat ulang halaman
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//         // Tangani error jika terjadi
//     });
// }

let currentEditingNis = null;

function editData(nis) {
    currentEditingNis = nis;
    fetch(`http://127.0.0.1:8000/api/posts/${nis}`)
        .then((res) => res.json())
        .then((data) => {
            const editForm = document.getElementById('editForm');
            
            // Isi form dengan data yang akan diedit
            editForm.nis.value = data[0].nis;
            editForm.nama.value = data[0].nama;
            editForm.jurusan.value = data[0].jurusan;
            editForm.tingkat.value = data[0].tingkat;
            editForm.jenis_kelamin.value = data[0].jenis_kelamin;
            editForm.nik.value = data[0].nik;
            editForm.tanggal_lahir.value = data[0].tanggal_lahir;
            editForm.alamat.value = data[0].alamat;
            editForm.no_tlp.value = data[0].no_tlp;
        });
}

function updateData() {
    if (currentEditingNis !== null) {
        const editForm = document.getElementById('editForm');
        const updatedData = {
            nis: editForm.nis.value,
            nama: editForm.nama.value,
            jurusan: editForm.jurusan.value,
            tingkat: editForm.tingkat.value,
            jenis_kelamin: editForm.jenis_kelamin.value,
            nik: editForm.nik.value,
            tanggal_lahir: editForm.tanggal_lahir.value,
            alamat: editForm.alamat.value,
            no_tlp: editForm.no_tlp.value
        };

        fetch(`http://127.0.0.1:8000/api/posts/${currentEditingNis}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then((res) => res.json())
        .then((data) => {
            // Proses hasil respon dari API setelah pembaruan berhasil
            console.log(data);
            // Tutup modal
            $('#editModal').modal('hide');
            // Lakukan pembaruan tampilan sesuai dengan respons dari API
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
