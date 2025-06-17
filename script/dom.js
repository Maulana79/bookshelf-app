/* BARU: Membuat elemen tags */
function createTags(tags) {
    const tagsContainer = document.createElement('div');
    tagsContainer.classList.add('book-tags');
    if (tags && tags.length > 0) {
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('tag-badge');
            tagElement.innerText = tag;
            tagsContainer.appendChild(tagElement);
        });
    }
    return tagsContainer;
}

function createStarRating(rating) {
    const ratingContainer = document.createElement('div');
    ratingContainer.classList.add('book-rating');
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.innerHTML = i <= rating ? '★' : '☆';
        ratingContainer.appendChild(star);
    }
    return ratingContainer;
}

export function createBookElement(bookObject) {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', bookObject.id);
    bookItem.setAttribute('data-testid', 'bookItem');
  
    const bookTitle = document.createElement('h3');
    bookTitle.setAttribute('data-testid', 'bookItemTitle');
    bookTitle.innerText = bookObject.title;
    bookTitle.classList.add('clickable-title'); // BARU: Class untuk klik
    bookTitle.dataset.action = 'detail'; // BARU: Aksi untuk detail

    const bookAuthor = document.createElement('p');
    bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
    bookAuthor.innerText = `Penulis: ${bookObject.author}`;
  
    const bookYear = document.createElement('p');
    bookYear.setAttribute('data-testid', 'bookItemYear');
    bookYear.innerText = `Tahun: ${bookObject.year}`;

    const ratingElement = createStarRating(bookObject.rating);
    const tagsElement = createTags(bookObject.tags); // BARU: Panggil fungsi tags

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('book-actions');

    const completeButton = document.createElement('button');
    completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    completeButton.innerText = bookObject.isComplete ? 'Belum Selesai' : 'Selesai';
    completeButton.dataset.action = 'toggle';
  
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.innerText = 'Hapus';
    deleteButton.dataset.action = 'delete';

    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.innerText = 'Edit';
    editButton.dataset.action = 'edit';
  
    buttonContainer.append(completeButton, deleteButton, editButton);
    // BARU: tagsElement ditambahkan
    bookItem.append(bookTitle, bookAuthor, bookYear, ratingElement, tagsElement, buttonContainer);
  
    return bookItem;
}

export function renderBooks(books) {
    // ... (Fungsi ini tidak berubah)
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
    for (const book of books) {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookList.append(bookElement);
        } else {
            incompleteBookList.append(bookElement);
        }
    }
}

export function showToast(message, type = 'success') {
    // ... (Fungsi ini tidak berubah)
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}

export function toggleModal(show, bookData = null) {
    // ... (fungsi ini diupdate untuk handle tags)
    const modal = document.getElementById('bookModal');
    const form = document.getElementById('bookForm');
    const modalTitle = document.getElementById('modalTitle');

    if (show) {
        form.reset();
        if (bookData) {
            modalTitle.innerText = 'Edit Buku';
            document.getElementById('bookId').value = bookData.id;
            document.getElementById('bookFormTitle').value = bookData.title;
            document.getElementById('bookFormAuthor').value = bookData.author;
            document.getElementById('bookFormYear').value = bookData.year;
            document.getElementById('bookFormRating').value = bookData.rating;
            // BARU: Mengisi input tags
            document.getElementById('bookFormTags').value = bookData.tags ? bookData.tags.join(', ') : '';
            document.getElementById('bookFormIsComplete').checked = bookData.isComplete;
        } else {
            modalTitle.innerText = 'Tambah Buku Baru';
            document.getElementById('bookId').value = '';
        }
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
}

/* BARU: Fungsi untuk mengelola halaman detail */
export function toggleDetailView(show, book = null) {
    const mainContent = document.querySelector('main');
    const detailView = document.getElementById('bookDetailView');

    if (show && book) {
        document.getElementById('detailTitle').innerText = book.title;
        document.getElementById('detailAuthor').innerText = `oleh ${book.author}`;
        document.getElementById('detailYear').innerText = `Tahun Terbit: ${book.year}`;
        document.getElementById('detailRating').innerHTML = '';
        document.getElementById('detailRating').appendChild(createStarRating(book.rating));
        document.getElementById('detailTags').innerHTML = '';
        document.getElementById('detailTags').appendChild(createTags(book.tags));

        mainContent.style.display = 'none';
        detailView.style.display = 'block';
    } else {
        mainContent.style.display = 'block';
        detailView.style.display = 'none';
    }
}