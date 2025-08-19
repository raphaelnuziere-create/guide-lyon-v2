export function updateQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams(window.location.search);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      searchParams.delete(key);
    } else {
      searchParams.set(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}