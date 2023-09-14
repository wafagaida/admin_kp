let currentNIS = null;
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

function formatDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        return `${day}-${month}-${year}`;
    } else {
        return dateString; // Jika format tidak sesuai, kembalikan tanggal yang sama
    }
}

function formatMonth(dateString) {
    const [year, month] = dateString.split('-');
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    if (month >= 1 && month <= 12) {
        const monthName = monthNames[parseInt(month) - 1];
        return `${monthName}-${year}`;
    } else {
        return dateString; // Jika format tidak sesuai, kembalikan tanggal yang sama
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

function removeDecimal(amount) {
    return amount.replace(/,00$/, '');
}

function filterNama() {
    const nama = document.getElementById('namaInput').value;
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';

    // Fetch siswa data with similar names
    fetch(`https://api.smkpsukaraja.sch.id/api/posts`)
        .then(response => response.json())
        .then(data => {
            const siswaInfo = document.getElementById('siswaInfo');

            loadingElement.style.display = 'none';

            const filteredSiswaList = data.data.filter(siswa => siswa.nama.toLowerCase().includes(nama.toLowerCase()));

            if (filteredSiswaList.length > 0) {
                const buttonsHTML = filteredSiswaList.map(siswa => {
                    return `
                    <div class="button-container" style="border-bottom: 1px solid #858796; padding-bottom: 10px;">
                        <button class="btn btn-light" style="font-size: 12px;" onclick="loadSiswaAndBayar(${siswa.nis})">${siswa.nama}</button>
                    </div>
                    <br>
                    `;
                }).join('');
                siswaInfo.innerHTML = buttonsHTML;
            } else {
                siswaInfo.innerHTML = "<p>Nama siswa tidak ditemukan.</p>";
            }
        })
        .catch(error => {
            loadingElement.style.display = 'none';

            const siswaInfo = document.getElementById('siswaInfo');
            siswaInfo.innerHTML = "<p>Tidak Bisa Terhubung ke Internet.</p>";
            console.error('Tidak Bisa Terhubung ke Internet:', error);
        });
}

// Event listener untuk submit formulir pencarian
document.querySelector('#searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    // loadData();
    filterNama();
});

// Event listener untuk tombol cari
document.querySelector('#searchForm button[type="submit"]').addEventListener('click', function (event) {
    event.preventDefault();
    // loadData();
    filterNama();
});

function loadSiswaAndBayar(nis) {
    currentNIS = nis;

    const siswaInfo = document.getElementById('siswaInfo');
    const tagihanInfo = document.getElementById('tagihanInfo');

    // Display loading messages
    siswaInfo.innerHTML = `<p class="text-center">Loading biodata...</p>`;
    tagihanInfo.innerHTML = `<p class="text-center">Loading data pembayaran...</p>`;

    // Fetch student biodata from a different API
    fetch(`https://api.smkpsukaraja.sch.id/api/posts/${nis}`)
        .then(response => response.json())
        .then(data => {
            const siswaInfo = document.getElementById('siswaInfo');
            // Display student biodata
            if (data.success && data.data.length > 0) {
                const biodata = data.data[0];

                siswaInfo.innerHTML = `
                <h5>Biodata Siswa</h5>
                <table table class="table table-bordered" id="bayar" width="100%" cellspacing="0">
                <tr>
                    <td>NIS</td>
                    <td>${biodata.nis}</td>
                </tr>
                <tr>
                    <td>Nama</td>
                    <td>${biodata.nama}</td>
                </tr>
                <tr>
                    <td>Jurusan</td>
                    <td>${biodata.jurusan}</td>
                </tr>
                <tr>
                    <td>Kelas</td>
                    <td>${biodata.kelas.nama_kelas}</td>
                </tr>
                <tr>
                    <td>Tahun Masuk</td>
                    <td>${biodata.tahun_masuk}</td>
                </tr>
                </table>
                <br>
`;
            } else {
                siswaInfo.innerHTML = "<p>Data siswa tidak ditemukan.</p>";
            }
        })
        .catch(error => {
            siswaInfo.innerHTML = "<p>Tidak Bisa Terhubung ke Internet.</p>";
            console.error('Tidak Bisa Terhubung ke Internet:', error);
        });

    // Fetch student grade data using the same NIS
    fetch(`https://api.smkpsukaraja.sch.id/api/bayar/${nis}`)
        .then(response => response.json())
        .then(data => {
            const bayarPerSemester = {};
            data.data.forEach(d => {
                const semester = d.semester;
                if (!bayarPerSemester[semester]) {
                    bayarPerSemester[semester] = [];
                }
                bayarPerSemester[semester].push(d);
            });

            const tagihanInfo = document.getElementById('tagihanInfo');

            if (data.success && data.data.length > 0) {

                tagihanInfo.innerHTML = `
                        <div class="card shadow mb-4">
                            <div class="card-header py-3">
                                <button type="button" class="btn btn-sukaraja btn-icon-split btn-sm" data-toggle="modal" data-target="#addModal" onclick="">
                                <span class="icon text-white">
                                    <i class="fas fa-plus"></i>
                                    </span>
                                    <span class="text">Tambah Data</span>
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered" id="" width="100%" cellspacing="0">
                                        ${Object.entries(bayarPerSemester).map(([semester, bayar]) => `
                                            <thead>
                                                <tr>
                                                    <td colspan="8" class="text-center text-gray-800"><h6>Semester ${semester}</h6></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Pembayaran</th>
                                                    <th>Bulan</th>
                                                    <th>Nominal Pembayaran</th>
                                                    <th>Jumlah Bayar</th>
                                                    <th>Tanggal Bayar</th>
                                                    <th>Keterangan</th>
                                                    <th></th>
                                                </tr>
                                                ${bayar.map((d, index) => `
                                                    <tr>
                                                        <td>${index + 1}</td>
                                                        <td>${d.nama_bayar}</td>
                                                        <td>${formatMonth(d.bulan)}</td>
                                                        <td>${removeDecimal(formatCurrency(d.nominal))}</td>
                                                        <td style="color: ${d.jumlah_bayar !== null && d.jumlah_bayar < d.nominal ? 'red' : 'black'}">
                                                        ${d.jumlah_bayar !== null ? removeDecimal(formatCurrency(d.jumlah_bayar)) : '-'}</td>
                                                        <td>${d.tgl_bayar !== null ? formatDate(d.tgl_bayar) : '-'}</td>
                                                        <td style="color: ${d.ket !== null && d.jumlah_bayar < d.nominal ? 'red' : 'inherit'}">
                                                        ${d.ket !== null ? `${d.ket} (${removeDecimal(formatCurrency(d.nominal - d.jumlah_bayar))})` : '-'}
                                                        </td>
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
                tagihanInfo.innerHTML = `
                        <div class="card shadow mb-4">
                            <div class="card-header py-3">
                                <button type="button" class="btn btn-sukaraja btn-icon-split btn-sm" data-toggle="modal" data-target="#addModal" onclick="">
                                <span class="icon text-white">
                                    <i class="fas fa-plus"></i>
                                    </span>
                                    <span class="text">Tambah Data</span>
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered" id="" width="100%" cellspacing="0">
                                        <tr>
                                                    <td colspan="4" class="text-center text-gray-800">Data Pembayaran tidak ditemukan</td>
                                                </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                                        
                                        `;
            }
        })
        .catch(error => {
            tagihanInfo.innerHTML = "<p>Tidak Bisa Terhubung ke Internet.</p>";
            console.error('Error fetching grade data:', error);
        });
};

document.querySelector('#searchForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nis = document.getElementById('nisInput').value;

    loadSiswaAndBayar(nis);

});

function addData() {
    const addForm = document.getElementById('addForm');
    const formData = new FormData(addForm);

    fetch("https://api.smkpsukaraja.sch.id/api/bayar", {
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
                // loadData()
                loadSiswaAndBayar(currentNIS);

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
    fetch(`https://api.smkpsukaraja.sch.id/api/bayar/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data) {
                const bayar = data.data;

                // Mengisi formulir edit dengan data yang sesuai
                document.getElementById('nama_bayar').value = bayar.nama_bayar;
                document.getElementById('bulan').value = bayar.bulan;
                document.getElementById('semester').value = bayar.semester;
                document.getElementById('nominal').value = bayar.nominal;
                document.getElementById('jumlah_bayar').value = bayar.jumlah_bayar;
                document.getElementById('tgl_bayar').value = bayar.tgl_bayar;
                document.getElementById('ket').value = bayar.ket;

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

    fetch(`https://api.smkpsukaraja.sch.id/api/bayar/${id}`, {
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

                // loadData();
                loadSiswaAndBayar(currentNIS);

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
        fetch(`https://api.smkpsukaraja.sch.id/api/bayar/${id}`, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    // loadData();
                    loadSiswaAndBayar(currentNIS);

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
