document.addEventListener("DOMContentLoaded", () => {
  let currentPage = "home";
  let currentBook = null;
  let books = [];

  const main =
    document.querySelector("main") ||
    (() => {
      const mainEl = document.createElement("main");
      document.body.appendChild(mainEl);
      return mainEl;
    })();

  const pageListMainContent = `<h2 class="text-2xl font-bold mb-4">Daftar Buku Perpustakaan</h2>
  
  <table class="min-w-full border border-gray-300">
    <thead>
      <tr>
        <th class="px-6 py-3 bg-gray-100 border-b text-left">Judul</th>
        <th class="px-6 py-3 bg-gray-100 border-b text-left">Penulis</th>
        <th class="px-6 py-3 bg-gray-100 border-b text-left">Tahun Terbit</th>
        <th class="px-6 py-3 bg-gray-100 border-b text-left">Jumlah</th>
        <th class="px-6 py-3 bg-gray-100 border-b text-center">Action</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>`;

  const pageEditBookMainContent = `<h2 class="text-2xl font-bold mb-4">Edit Buku</h2>
  
  <form class="max-w-sm mx-auto" onsubmit="return handleEditForm(event)">
  </form>
  `;

  const pageAddBookMainContent = `<h2 class="text-2xl font-bold mb-4">Tambah Buku</h2>
  
  <form class="max-w-sm mx-auto" onsubmit="return handleAddForm(event)">
    <div class="mb-4">
      <label for="title" class="block text-gray-700 font-semibold mb-2">Judul Buku</label>
      <input required type="text" id="title" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
    </div>
    <div class="mb-4">
      <label for="author" class="block text-gray-700 font-semibold mb-2">Penulis Buku</label>
      <input required type="text" id="author" name="author" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
    </div>
    <div class="mb-4">
      <label for="year" class="block text-gray-700 font-semibold mb-2">Tahun Terbit</label>
      <input required type="number" id="year" name="year" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
    </div>
    <div class="mb-4">
      <label for="quantity" class="block text-gray-700 font-semibold mb-2">Jumlah Stok</label>
      <input required type="number" id="quantity" name="quantity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
    </div>
    <div class="flex justify-center">
      <input type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="Tambah Buku" />
    </div>
  </form>
  `;


  window.handleClickEditButton = async function (bookId) {
    try {
      const response = await fetch(`http://localhost:3333/books/${bookId}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil data buku");
      }
      currentBook = await response.json();
      currentPage = "edit";
      loadPage();
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data buku", error);
    }
  };

  window.handleClickDeleteButton = async function (bookId) {
    try {
      // Konfirmasi penghapusan (bisa diaktifkan kembali jika diperlukan)
      // const confirmation = confirm('Apakah anda yakin ingin menghapus buku ini?');
      // if (!confirmation) {
      //   return;
      // }

      await deleteBook(bookId);
      loadPage();
    } catch (error) {
      console.log(error);
      console.log("Terjadi kesalahan saat menghapus buku");
    }
  };

  window.handleEditForm = async function (event) {
    try {
      event.preventDefault();

      const form = event.target;
      const book = {
        title: form.title.value,
        author: form.author.value,
        year: parseInt(form.year.value),
        quantity: parseInt(form.quantity.value),
      };

      await editBook(currentBook.id, book);

      currentBook = null; 

      currentPage = "home"; 
      loadPage(); 
    } catch (error) {
      console.log(error);
      console.log("Terjadi kesalahan saat mengubah buku");
    }
  };

  window.handleAddForm = async function (event) {
    try {
      event.preventDefault();

      const form = event.target;
      const book = {
        title: form.title.value,
        author: form.author.value,
        year: parseInt(form.year.value),
        quantity: parseInt(form.quantity.value),
      };

      await addBook(book);
      currentPage = "home";
      loadPage();
    } catch (error) {
      console.log(error);
      console.log("Terjadi kesalahan saat menambah buku");
    }
  };

  window.handleClickAddNav = function () {
    currentPage = "add";
    loadPage();
  };

  const navLinks = document.querySelectorAll("li a");
  navLinks.forEach((navLink) => {
    navLink.addEventListener("click", handleClickAddNav);
  });

  function generateRows(books) {
    if (!Array.isArray(books)) {
      console.error("Expected an array but received:", books); 
      books = []; 
    }

    let rows = "";
    if (books.length === 0) {
      rows = `<tr>
        <td colspan="5" class="px-6 py-4 border-b text-center">Tidak ada buku yang ditemukan</td>
      </tr>`;
    } else {
      books.forEach((book) => {
        rows += `<tr class="book-item">
          <td class="px-6 py-4 border-b">${book.title}</td>
          <td class="px-6 py-4 border-b">${book.author}</td>
          <td class="px-6 py-4 border-b">${book.year}</td>
          <td class="px-6 py-4 border-b">${book.quantity}</td>
          <td class="px-6 py-4 border-b text-center">
            <button class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="handleClickEditButton(${book.id})">Edit</button>
            <button class="inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="handleClickDeleteButton(${book.id})">Hapus</button>
          </td>
        </tr>`;
      });
    }
    return rows;
  }

  function generateEditFormInput() {
    return `<div class="mb-4">
    <label for="title" class="block text-gray-700 font-semibold mb-2">Judul Buku</label>
    <input required type="text" id="title" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.title}">
  </div>
  <div class="mb-4">
    <label for="author" class="block text-gray-700 font-semibold mb-2">Penulis Buku</label>
    <input required type="text" id="author" name="author" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.author}">
  </div>
  <div class="mb-4">
    <label for="year" class="block text-gray-700 font-semibold mb-2">Tahun Terbit</label>
    <input required type="number" id="year" name="year" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.year}">
  </div>
  <div class="mb-4">
    <label for="quantity" class="block text-gray-700 font-semibold mb-2">Jumlah Stok</label>
    <input required type="number" id="quantity" name="quantity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.quantity}">
  </div>
  <div class="flex justify-center">
    <input type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="simpan" />
  </div>`;
  }

  async function loadPage() {
    switch (currentPage) {
      case "home":
        const books = await fetchBooks();
        console.log("Fetched books:", books); 

        main.innerHTML = pageListMainContent;

        const tableBody = document.querySelector("tbody");
        const rows = generateRows(books);
        console.log("Generated rows:", rows);
        tableBody.innerHTML = rows;

        break;

      case "edit":
        main.innerHTML = pageEditBookMainContent;

        const form = document.querySelector("form");
        if (currentBook) {
          const formInput = generateEditFormInput(currentBook);
          form.innerHTML = formInput;
        } else {
          console.error("Current book is not defined");
        }

        break;
      case "add":
        main.innerHTML = pageAddBookMainContent;
        break;
      default:
        console.error("Invalid page: ", currentPage);
        break;
    }
  }

  async function fetchBooks() {
    try {
      const response = await fetch("http://localhost:3333/books");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return Array.isArray(data) ? data : []; 
    } catch (error) {
      console.error("Failed to fetch books:", error);
      return []; 
    }
  }

  async function addBook(book) {
    try {
      const response = await fetch("http://localhost:3333/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error("Gagal menambah buku");
      }

      console.log("Buku berhasil ditambahkan"); // Opsional: untuk konfirmasi
    } catch (error) {
      console.log(error);
      console.log("Terjadi kesalahan saat menambah buku");
    }
  }

  // Ubah fungsi editBook
  async function editBook(bookId, book) {
    try {
      const response = await fetch(`http://localhost:3333/books/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error("Gagal mengubah buku");
      }

      console.log("Buku berhasil diubah");
    } catch (error) {
      console.log(error);
      console.log("Terjadi kesalahan saat mengubah buku");
    }
  }

  async function deleteBook(bookId) {
    try {
      const response = await fetch(`http://localhost:3333/books/${bookId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus buku");
      }

      console.log("Buku berhasil dihapus");
    } catch (error) {
      console.log(error);
      console.log("Terjadi kesalahan saat menghapus buku");
    }
  }

  loadPage();
});
