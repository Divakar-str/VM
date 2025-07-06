const API_URL = 'https://script.google.com/macros/s/AKfycbzBO1HKednE8PSBVov_9bDOxSkbHJw7MeXxIGMy4dFEjk1i9SV2UJBNqyVoDkBdzQUo/exec'; // Replace with your script URL


// Convert yyyy-mm-dd (HTML date) to dd-mm-yyyy (for storage)
function formatToDDMMYYYY(isoDate) {
  if (!isoDate) return '';
  const [yyyy, mm, dd] = isoDate.split('-');
  return `${dd}-${mm}-${yyyy}`;
}

// Convert dd-mm-yyyy (from storage) to yyyy-mm-dd (for HTML input)
function parseToISO(dateStr) {
  if (!dateStr) return '';
  const [dd, mm, yyyy] = dateStr.split("-");
  return `${yyyy}-${mm}-${dd}`;
}

// Load data from Google Sheet
async function loadData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    renderTable(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Render table with fetched data
function renderTable(data) {
  const tbody = document.getElementById('vehicleTableBody');
  tbody.innerHTML = '';

  data.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.VehicleNo || ''}</td>
      <td>${row.TAX || ''}</td>
      <td>${row.GTAX || ''}</td>
      <td>${row.OwnerName || ''}</td>
      <td>${row.Mobile || ''}</td>
      <td>${row.FC || ''}</td>
      <td>${row.AIP || ''}</td>
      <td>${row.PE || ''}</td>
      <td>${row.CHNo || ''}</td>
      <td>${row.Remarks || ''}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editRow(${index})">✏️ Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteRow('${row.VehicleNo}')">🗑 Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  window.allData = data; // Save for edit
}

// Handle form submission
document.getElementById('vehicleForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const payload = {
    action: document.getElementById('editIndex').value ? 'update' : 'add',
    vehicleNo: document.getElementById('vehicleNo').value.trim(),
    tax: formatToDDMMYYYY(document.getElementById('tax').value),
    gtax: formatToDDMMYYYY(document.getElementById('gtax').value),
    ownerName: document.getElementById('ownerName').value.trim(),
    mobile: document.getElementById('mobile').value.trim(),
    fc: formatToDDMMYYYY(document.getElementById('fc').value),
    aip: formatToDDMMYYYY(document.getElementById('aip').value),
    pe: formatToDDMMYYYY(document.getElementById('pe').value),
    chNo: document.getElementById('chNo').value.trim(),
    remarks: document.getElementById('remarks').value.trim()
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.text();
    alert(result);
    this.reset();
    document.getElementById('editIndex').value = '';
    loadData();
  } catch (err) {
    console.error('Submit error:', err);
    alert('Something went wrong!');
  }
});

// Fill form to edit
function editRow(index) {
  const v = window.allData[index];
  document.getElementById('editIndex').value = index;
  document.getElementById('vehicleNo').value = v.VehicleNo || '';
  document.getElementById('tax').value = parseToISO(v.TAX);
  document.getElementById('gtax').value = parseToISO(v.GTAX);
  document.getElementById('ownerName').value = v.OwnerName || '';
  document.getElementById('mobile').value = v.Mobile || '';
  document.getElementById('fc').value = parseToISO(v.FC);
  document.getElementById('aip').value = parseToISO(v.AIP);
  document.getElementById('pe').value = parseToISO(v.PE);
  document.getElementById('chNo').value = v.CHNo || '';
  document.getElementById('remarks').value = v.Remarks || '';
}

// Delete vehicle row
async function deleteRow(vehicleNo) {
  if (!confirm('Are you sure you want to delete this record?')) return;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', vehicleNo })
    });
    const result = await res.text();
    alert(result);
    loadData();
  } catch (err) {
    console.error('Delete error:', err);
    alert('Failed to delete record.');
  }
}

// Initial load
loadData();
