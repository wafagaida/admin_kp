
// api url
const api_url =
      "https://jsonplaceholder.typicode.com/posts";
 
// Defining async function
async function getapi(url) {
   
    // Storing response
    const response = await fetch(url);
   
    // Storing data in form of JSON
    var data = await response.json();
    console.log(data);
    if (response) {
        hideloader();
    }
    show(data);
}
// Calling that async function
getapi(api_url);
 
// Function to hide the loader
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}
// Function to define innerHTML for HTML table
function show(data) {
    let tab =
        `<tr>
          <th>NIS</th>
          <th>Nama</th>
          <th>Jurusan</th>
          <th>Kelas</th>
         </tr>`;
   
    // Loop to access all rows
    for (let r of data.list) {
        tab += `<tr>
    <td>${r.userId} </td>
    <td>${r.id}</td>
    <td>${r.title}</td>
    <td>${r.body}</td>         
</tr>`;
    }
    // Setting innerHTML as tab variable
    document.getElementById("employees").innerHTML = tab;
}

// function getPosts() {
//     fetch('https://jsonplaceholder.typicode.com/posts')
//     .then((res) => res.json())
//     .then((data) => {
//         let output = '<h2 class="mb-4">Posts</h2>';
//         console.log(data);
//         data.forEach((post) => {
//             output += `
//                 <div class="card card-body mb-3">
//                     <h3>${post.title}</h3>
//                     <p>${post.body}</p>
//                 </div>
//             `;
//         });
//         document.getElementById('output').innerHTML = output;
//     })
// }