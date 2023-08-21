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
            <td>${post.user.nama}</td>
            <td>${post.mapel.nama_mapel}</td>
            <td>${post.mapel.nama_guru}</td>
            <td>${post.nilai ? post.nilai : 'Belum Ada Nilai'}</td>
            <td>${post.semester}</td>
            <td>
            <button type="button" class="btn btn-sukaraja btn-icon-split btn-sm" data-toggle="modal" data-target="#editModal" onclick="editData(${post.id})">
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


function searchSiswa() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const semester = document.getElementById('semesterSelect').value;
    const tableRows = document.querySelectorAll('#tableBody tr');

    tableRows.forEach((row) => {
        const namaSiswa = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const rowSemester = row.querySelector('td:nth-child(6)').textContent;

        const matchesName = namaSiswa.includes(input);
        const matchesSemester = !semester || rowSemester === semester;

        if (matchesName && matchesSemester) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function getPosts() {
    showLoading();
    fetch('http://127.0.0.1:8000/api/nilai') // Ganti dengan endpoint API Anda
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

            tableBody.innerHTML = ''; // Kosongkan isi tabel
            tableBody.appendChild(fragment);

            populateSemesterSelect(data.semesters); // Populasi opsi semester
            // searchSiswa(); // Panggil fungsi pencarian
            document.getElementById('searchInput').addEventListener('keyup', function () {
                searchSiswa(); // Panggil fungsi pencarian
            });
        });
}

function populateSemesterSelect(semesters) {
    const select = document.getElementById('semesterSelect');

    semesters.forEach((semester) => {
        const option = document.createElement('option');
        option.value = semester;
        option.textContent = `Semester ${semester}`;
        select.appendChild(option);
    });
}


// function getPosts() {
//     showLoading();
//     fetch('http://127.0.0.1:8000/api/nilai') // Ganti dengan endpoint API Anda
//         .then((res) => res.json())
//         .then((data) => {
//             hideLoading();
//             console.log(data);

//             const nilaiPerSemester = {};

//             data.data.forEach((post) => {
//                 const semester = post.semester;

//                 if (!nilaiPerSemester[semester]) {
//                     nilaiPerSemester[semester] = [];
//                 }

//                 nilaiPerSemester[semester].push(post);
//             });

//             const tableBody = document.getElementById('tableBody');
//             tableBody.innerHTML = '';

//             for (const semester in nilaiPerSemester) {
//                 const semesterData = nilaiPerSemester[semester];

//                 const semesterRow = `
//                     <tr>
//                         <td colspan="6" class="text-center bg-light">Semester ${semester}</td>
//                     </tr>
//                 `;

//                 tableBody.innerHTML += semesterRow;

//                 semesterData.forEach((post) => {
//                     const row = createTableRow(post);
//                     const tr = document.createElement('tr');
//                     tr.innerHTML = row;
//                     tableBody.appendChild(tr);
//                 });
//             }

//             searchSiswa(); // Panggil fungsi pencarian
//         });
// }
