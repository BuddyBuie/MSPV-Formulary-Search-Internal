const table = document.querySelector("#output");

const ROWS_PER_PAGE = 5000;

let currentPage = 0;

let allData = [];

function fetchData(url) {
  return fetch(url).then(res => res.json());
}

function renderTable(data, startIndex, endIndex) {
  const rows = data.slice(startIndex, endIndex)
    .map(row => `
      <tr>
        <td>${row.Medline_PVON}</td>
        <td>${row.Short_Description}</td>
        <td>${row.OEM_Part_Num}</td>
      </tr>
    `)
    .join('');

  table.innerHTML += rows;
}

function loadMore() {
  const startIndex = currentPage * ROWS_PER_PAGE;
  const endIndex = (currentPage + 1) * ROWS_PER_PAGE;

  renderTable(allData, startIndex, endIndex);

  currentPage++;
}

function search(event) {
  const search = event.target.value.trim().toLowerCase();
  currentPage = 0;
  table.innerHTML = '';

  const filteredData = allData.filter(row => {
    const medline_pvon = row.Medline_PVON.toString().toLowerCase();
    const short_description = row.Short_Description.toLowerCase();
    const oem_part_num = row.OEM_Part_Num.toLowerCase();

    return (
      medline_pvon.includes(search) ||
      short_description.includes(search) ||
      oem_part_num.includes(search)
    );
  });

  renderTable(filteredData, 0, ROWS_PER_PAGE);
  currentPage++;
}

function init() {
  fetchData('https://raw.githubusercontent.com/BuddyBuie/Formulary-Json/main/Formulary%203-16-23.json')
    .then(data => {
      allData = data;
      renderTable(allData, 0, ROWS_PER_PAGE);
      currentPage++;
    });

  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMore();
    }
  });

  document.querySelector("#search").addEventListener('input', search);
}

window.onload = init;
