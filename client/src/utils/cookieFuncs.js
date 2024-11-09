export const setCookie = (name, value, hours) => {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000); 
  // Allow cross-site
  // document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; samesite=None; secure`;
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; samesite=strict; `;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=None; secure`;
};

// Usage
// deleteCookie('username');

