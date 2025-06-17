import { saveBooks, loadBooks } from './storage.js';
import { renderBooks, showToast, toggleModal, toggleDetailView } from './dom.js';

document.addEventListener('DOMContentLoaded', () => {
    let books = loadBooks();
    let currentSort = 'title-asc';

    const searchInput = document.getElementById('searchBookTitle');
    const sortSelect = document.getElementById('sort-books');
    
    function refreshAndRender() { /* ... (fungsi ini tidak berubah) ... */ 
        const query = searchInput.value.toLowerCase();
        let booksToRender = books;

        if (query) {
            booksToRender = books.filter(book => book.title.toLowerCase().includes(query));
        }

        booksToRender.sort((a, b) => {
            switch (currentSort) {
                case 'title-asc': return a.title.localeCompare(b.title);
                case 'title-desc': return b.title.localeCompare(a.title);
                case 'year-desc': return b.year - a.year;
                case 'year-asc': return a.year - b.year;
                default: return 0;
            }
        });
        
        renderBooks(booksToRender);
    }

    function findBook(bookId) {
        return books.find(book => book.id === bookId);
    }

    document.getElementById('addBookButton').addEventListener('click', () => toggleModal(true));
    document.getElementById('cancelModalButton').addEventListener('click', () => toggleModal(false));
    
    // BARU: Tombol kembali dari halaman detail
    document.getElementById('backToListButton').addEventListener('click', () => toggleDetailView(false));
    
    document.getElementById('bookForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const bookId = document.getElementById('bookId').value;
        const tagsInput = document.getElementById('bookFormTags').value;

        const bookData = {
            id: bookId ? Number(bookId) : +new Date(),
            title: document.getElementById('bookFormTitle').value,
            author: document.getElementById('bookFormAuthor').value,
            year: Number(document.getElementById('bookFormYear').value),
            rating: Number(document.getElementById('bookFormRating').value),
            // BARU: Memproses input tags menjadi array
            tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag),
            isComplete: document.getElementById('bookFormIsComplete').checked,
        };

        if (bookId) {
            const bookIndex = books.findIndex(book => book.id === Number(bookId));
            books[bookIndex] = bookData;
            showToast('Buku berhasil diperbarui', 'success');
        } else {
            books.push(bookData);
            showToast('Buku berhasil ditambahkan', 'success');
        }

        saveBooks(books);
        refreshAndRender();
        toggleModal(false);
    });

    document.querySelector('main').addEventListener('click', (event) => {
        const target = event.target;
        const bookItem = target.closest('[data-bookid]');
        if (!bookItem) return;

        const bookId = Number(bookItem.dataset.bookid);
        const action = target.dataset.action;

        if (action === 'edit') {
            const bookToEdit = findBook(bookId);
            toggleModal(true, bookToEdit);
        } else if (action === 'delete') {
            if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
                books = books.filter(book => book.id !== bookId);
                saveBooks(books);
                refreshAndRender();
                showToast('Buku berhasil dihapus', 'error');
            }
        } else if (action === 'toggle') {
            const bookToToggle = findBook(bookId);
            bookToToggle.isComplete = !bookToToggle.isComplete;
            saveBooks(books);
            refreshAndRender();
        } else if (action === 'detail') { // BARU: Menangani klik pada judul
            const bookToShow = findBook(bookId);
            if (bookToShow) toggleDetailView(true, bookToShow);
        }
    });

    searchInput.addEventListener('input', refreshAndRender);
    sortSelect.addEventListener('change', (event) => {
        currentSort = event.target.value;
        refreshAndRender();
    });

    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('change', () => { /* ... (fungsi ini tidak berubah) ... */ 
        if(themeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'light';

    // BARU: Sinkronisasi antar tab
    window.addEventListener('storage', (event) => {
        if (event.key === 'BOOKSHELF_APPS_ADVANCED') {
            books = loadBooks();
            refreshAndRender();
            showToast('Data disinkronkan dari tab lain', 'success');
        }
    });

    refreshAndRender();
});