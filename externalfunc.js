function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
function parseBookingDate(dateString) {
  const [weekday, datePart] = dateString.split(' ');
  const [day, month, year] = datePart.split('.').map(part => parseInt(part, 10));
  return new Date(year, month - 1, day);
}

function formatDateString(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function convertDateFormat(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1.$2.$3').replace(',', '');
}

// search SalesOpp
function searchBySalesOpp(value) {
  return SalesOppList.filter(item => item.CRM_ID === value);
}