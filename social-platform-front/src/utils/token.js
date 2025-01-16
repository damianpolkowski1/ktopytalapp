export function waitForToken() {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        clearInterval(interval);
        resolve(token);
      }
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      reject(new Error('Token nie został ustawiony w localStorage.'));
    }, 5000);
  });
}