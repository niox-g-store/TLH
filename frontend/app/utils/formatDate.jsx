export function formatDate(isoDateStr) {
  const date = new Date(isoDateStr);

  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}