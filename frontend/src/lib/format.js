export function formatDate(value) {
  if (!value) return 'Never';
  return new Date(value).toLocaleString();
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

