const STORAGE_KEY = 'BOOKSHELF_APPS_ADVANCED';

/**
 * Memeriksa apakah localStorage didukung oleh browser.
 * @returns {boolean}
 */
export function isStorageExist() {
  if (typeof Storage === 'undefined') {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * Menyimpan data buku ke localStorage.
 * @param {Array} books - Array objek buku.
 */
export function saveBooks(books) {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

/**
 * Memuat data buku dari localStorage.
 * @returns {Array} - Array objek buku.
 */
export function loadBooks() {
  if (isStorageExist()) {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(serializedData) || [];
  }
  return [];
}