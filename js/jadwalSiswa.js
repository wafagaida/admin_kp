let selectedKelas;

function loadData() {
    selectedKelas = 'kelas_terpilih';
    loadJadwal(selectedKelas);
}

async function loadJadwal(selectedKelas) {

    const siswaInfo = document.getElementById('siswaInfo');
    const nilaiInfo = document.getElementById('nilaiInfo');

    nilaiInfo.innerHTML = `<p class="text-center">Loading jadwal pelajaran...</p>`;

    try {
        // Fetch jadwal pelajaran berdasarkan kelas yang dipilih
        const response = await fetch(`http://127.0.0.1:8000/api/jadwal/${selectedKelas}`);
        const data = await response.json();

        const jadwalPerHari = {};
        data.data.forEach(d => {
            const hari = d.hari;
            if (!jadwalPerHari[hari]) {
                jadwalPerHari[hari] = [];
            }
            jadwalPerHari[hari].push(d);
        });

        if (data.success && data.data.length > 0) {
            const kelas = data.data[0].kelas;
            const jadwal = data.data;

            // Update class info
            siswaInfo.innerHTML = `
            <h5>Detail Kelas</h5>
            <table class="table table-bordered" id="jadwal" width="100%" cellspacing="0">
                <tr>
                    <td>Tingkat</td>
                    <td>${kelas.tingkat}</td>
                </tr>
                <tr>
                    <td>Jurusan</td>
                    <td>${kelas.jurusan}</td>
                </tr>
                <tr>
                    <td>Kelas</td>
                    <td>${kelas.nama_kelas}</td>
                </tr>
            </table>
            <br>
        `;

            // Update jadwal pelajaran
            nilaiInfo.innerHTML = `
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <button type="button" class="btn btn-sukaraja btn-icon-split btn-sm" data-toggle="modal" data-target="#addModal" onclick="">
                    <span class="icon text-white">
                        <i class="fas fa-plus"></i>
                        </span>
                        <span class="text">Tambah Jadwal</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="" width="100%" cellspacing="0">
                            ${Object.entries(jadwalPerHari).map(([hari, jadwal]) => `
                            <thead>
                                <tr>
                                    <td colspan="7" class="text-center text-gray-800"><h6>${hari}</h6></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>No.</th>
                                    <th>Jam</th>
                                    <th>Mata Pelajaran</th>
                                    <th>Nama Guru</th>
                                    <th></th>
                                </tr>
                                ${jadwal.map((d, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${d.jam}</td>
                                        <td>${d.mapel ? d.mapel.nama_mapel : ''}</td>
                                        <td>${d.mapel ? d.mapel.nama_guru : ''}</td>
                                        <td>
                                            <button type="button" class="btn btn-success btn-icon-split btn-sm" data-toggle="modal" data-target="#editModal" onclick="prepareEditData(${d.id})" data-id="${d.id}">
                                                <span class="icon text-white">
                                                    <i class="fas fa-edit"></i>
                                                </span>
                                            </button>
                                            <a href="#" class="btn btn-danger btn-icon-split btn-sm" onclick="deleteData('${d.id}')">
                                                <span class="icon text-white">
                                                    <i class="fas fa-trash"></i>
                                                </span>
                                            </a>
                                        </td>
                                    </tr>
                                `).join('')}
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        } else {
            siswaInfo.innerHTML = "<p>Data jadwal tidak ditemukan.</p>";
            nilaiInfo.innerHTML = `
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <button type="button" class="btn btn-sukaraja btn-icon-split btn-sm" data-toggle="modal" data-target="#addModal" onclick="">
                    <span class="icon text-white">
                        <i class="fas fa-plus"></i>
                        </span>
                        <span class="text">Tambah Jadwal</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="" width="100%" cellspacing="0">
                            <tr>
                                <td colspan="4" class="text-center text-gray-800">Data Jadwal tidak ditemukan</td>
                            </tr>
                        </table>
                        </div>
                    </div>
                </div>
                                    
            `;
        }
    } catch (error) {
        nilaiInfo.innerHTML = "<p>Error fetching data.</p>";
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const kelasDropdown = document.getElementById('kelasDropdown');
    const searchForm = document.getElementById('searchForm');

    // Fetch daftar kelas
    try {
        const response = await fetch('http://127.0.0.1:8000/api/kelas');
        const data = await response.json();

        if (data.success) {
            // Populate dropdown with class options
            data.data.forEach(kelas => {
                const option = document.createElement('option');
                option.value = kelas.kd_kelas;
                option.textContent = kelas.kd_kelas;
                kelasDropdown.appendChild(option);
            });
        } else {
            console.error('Failed to fetch class data.');
        }
    } catch (error) {
        console.error('Error fetching class data:', error);
    }

    // Event listener when form is submitted
    searchForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        selectedKelas = kelasDropdown.value;
        await loadJadwal(selectedKelas);
    });
});

function fillMapelOptions() {
    fetch(`http://localhost:8000/api/mapel`)
        .then(response => response.json())
        .then(data => {
            const kdMapelSelect = document.getElementById('kd_mapel');

            if (data.success && data.data.length > 0) {
                data.data.forEach(mapel => {
                    const option = document.createElement('option');
                    option.value = mapel.kd_mapel;
                    option.textContent = `${mapel.nama_mapel} (${mapel.nama_guru})`;
                    kdMapelSelect.appendChild(option);
                });
            } else {
                const defaultOption = document.createElement('option');
                defaultOption.value = 'Jurusan';
                defaultOption.textContent = '-- Pilih Satu --';
                kdMapelSelect.appendChild(defaultOption);
            }
        })
        .catch(error => {
            console.error('Error fetching mata pelajaran:', error);
        });
}

fillMapelOptions();

function fillEditMapelOptions() {
    fetch(`http://localhost:8000/api/mapel`)
        .then(response => response.json())
        .then(data => {
            const kdMapelSelect = document.getElementById('kd_mapel_edit');

            if (data.success && data.data.length > 0) {
                data.data.forEach(mapel => {
                    const option = document.createElement('option');
                    option.value = mapel.kd_mapel;
                    option.textContent = `${mapel.nama_mapel} (${mapel.nama_guru})`;
                    kdMapelSelect.appendChild(option);
                });
            } else {
                const defaultOption = document.createElement('option');
                defaultOption.value = 'Jurusan';
                defaultOption.textContent = '-- Pilih Satu --';
                kdMapelSelect.appendChild(defaultOption);
            }
        })
        .catch(error => {
            console.error('Error fetching mata pelajaran:', error);
        });
}

// Panggil fungsi untuk mengisi opsi kd_mapel_edit saat halaman dimuat
fillEditMapelOptions();

function addData() {
    const addForm = document.getElementById('addForm');
    const formData = new FormData(addForm);
    const modalBody = document.querySelector('.modal-body');

    fetch("http://127.0.0.1:8000/api/jadwal", {
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
                // loadJadwal(selectedKelas);
                selectedKelas = formData.get('kd_kelas');
                loadData();

                $('#successMessage-add').modal('show');

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
    // Mendapatkan data nilai berdasarkan ID dari API atau dari sumber data lainnya
    fetch(`http://127.0.0.1:8000/api/jadwal/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data) {
                const jadwal = data.data; // Data nilai yang akan diedit

                // Mengisi formulir edit dengan data yang sesuai
                document.getElementById('tingkat').value = jadwal.tingkat;
                document.getElementById('kd_kelas').value = jadwal.kd_kelas;
                document.getElementById('hari').value = jadwal.hari;
                document.getElementById('kd_mapel_edit').value = jadwal.kd_mapel;
                document.getElementById('jam').value = jadwal.jam;

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
    const modalBody = document.querySelector('.modal-body');

    const editButton = document.getElementById('editDataButton');
    const id = editButton.getAttribute('data-id');

    fetch(`http://127.0.0.1:8000/api/jadwal/${id}`, {
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

                loadData();

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
        fetch(`http://127.0.0.1:8000/api/jadwal/${id}`, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    loadData();

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