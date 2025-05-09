export const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'N/A';
    const nameParts = name.trim().split(' ').filter(part => part);
    if (nameParts.length === 0) return 'N/A';
    const initials = nameParts
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('');
    return initials || 'N/A';
  };