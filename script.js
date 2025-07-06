const API_URL = 'https://script.google.com/macros/s/AKfycbyuOW7AplgNUghQitlRgPuwZW7oF-CI5SlsJ6t2neHKuCLq4onYV7WvJa2N6LsAfXk/exec'; // Replace this

const form = document.getElementById('vehicleForm');
const tbody = document.querySelector('#vehicleTable tbody');

let vehicleList = [];

function loadData() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      vehicleList = data;
      renderTable();
    });
}

function renderTable() {
  tbody.innerHTML = '';
  vehicleList.forEach((v, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${v.VehicleNo}</td>
        <td>${v.TAX}</td>
        <td>${v.GTAX}</td>
        <td>${v.OwnerName}</td>
        <td>${v.Mobile}</td>
        <td>${v.FC}</td>
        <td>${v.AIP}</td>
        <td>${v.PE}</td>
        <td>${v.CHNo}</td>
        <td>${v.Remarks}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editRow(${i})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteRow('${v.VehicleNo}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    action: document.getElementById('editIndex').value ? 'update' : 'add',
    vehicleNo: document.getElementById('vehicleNo').value.trim(),
    tax: document.getElementById('tax').value,
    gtax: document.getElementById('gtax').value,
    ownerName: document.getElementById('ownerName').value,
    mobile: document.getElementById('mobile').value,
    fc: document.getElementById('fc').value,
    aip: document.getElementById('aip').value,
    pe: document.getElementById('pe').value,
    chNo: document.getElementById('chNo').value,
    remarks: document.getElementById('remarks').value
  };

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  }).then(() => {
    form.reset();
    document.getElementById('editIndex').value = '';
    loadData();
  });
});

function editRow(index) {
  const v = vehicleList[index];
  document.getElementById('vehicleNo').value = v.VehicleNo;
  document.getElementById('tax').value = v.TAX;
  document.getElementById('gtax').value = v.GTAX;
  document.getElementById('ownerName').value = v.OwnerName;
  document.getElementById('mobile').value = v.Mobile;
  document.getElementById('fc').value = v.FC;
  document.getElementById('aip').value = v.AIP;
  document.getElementById('pe').value = v.PE;
  document.getElementById('chNo').value = v.CHNo;
  document.getElementById('remarks').value = v.Remarks;
  document.getElementById('editIndex').value = index;
}

function deleteRow(vehicleNo) {
  if (!confirm('Delete this entry?')) return;
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', vehicleNo }),
    headers: { 'Content-Type': 'application/json' }
  }).then(() => loadData());
}

loadData();
