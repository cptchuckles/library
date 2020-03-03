function Book(title, author, length, read) {
  this.title = title;
  this.author = author;
  this.length = length;
  this.read = read;
}


Book.prototype.toString = function() {
  return `${this.title} `
       + `by ${this.author}, `
       + `${this.length} pages, `
       + `${this.read ? "read already" : "not read yet"}`;
};

Book.prototype.toggleRead = function() {
  this.read = !this.read;
};



/*
 * Example book
 */
const theHobbit = new Book("The Hobbit", "J.R.R. Tolkein", 295, false);


/*
 *
 * Execution stuff
 */

let library = [];

library.push( theHobbit );
library.push( new Book(
  "Necronomicon",
  "H.P. Lovecraft",
  666,
  true
));


function renderLibrary() {
  const libraryTableBody = document.querySelector("#books>tbody");
  libraryTableBody.innerHTML = "";

  library.forEach( (book, i) => {
    const row = document.createElement("tr");
    row.setAttribute( "data-row", String(i) );

    row.innerHTML = `
      <td>
        <input type="checkbox" class="selection" data-row="${i}" />
      </td>
      <td>${book.title}</td>
      <td>${book.author}</td> 
      <td>${book.length}</td> 
      <td>
        <a href="#">${book.read ? "yes already" : "not yet"}</a>
      </td>`;

    libraryTableBody.appendChild( row );
    document.querySelector(`#books tr[data-row="${i}"] a`)
            .addEventListener("click", () => toggleBookRead(i) );
  });

  document.querySelectorAll(".selection").forEach( box => {
    box.addEventListener("change", setMasterCheckbox );
    
    const row = Number(box.getAttribute("data-row"));
    box.addEventListener("change", () => setRowBackground(row) );
  });

  const masterCheckbox = document.getElementById("select-all");
  masterCheckbox.indeterminate = false;
  masterCheckbox.checked = false;
}


function setRowBackground( i ) {
  const row = document.querySelector(`#books tr[data-row="${i}"]`);
  const checkbox = document.querySelector(`.selection[data-row="${i}"]`);
  row.classList.toggle("highlight", checkbox.checked);
}
function highlightSelectedRows() {
  for(const book in library) setRowBackground(book);
}


function setMasterCheckbox() {
  let checked = undefined;
  const master = document.getElementById("select-all");
  master.indeterminate = false;

  for(const checkbox of document.querySelectorAll(".selection")) {
    if( checkbox.checked != checked ) {
      if( checked === undefined )
        checked = checkbox.checked;
      else {
        master.indeterminate = true;
        return;
  } } }

  master.checked = checked;
}


function toggleBookRead( bookIndex ) {
  library[ bookIndex ].toggleRead();
  renderLibrary();
}


function addBook() {
  const inputs = document.querySelectorAll("#new-book-form input");

  let book = {};
  inputs.forEach( input => {
    if( input.type == "checkbox" ) {
      book[input.name] = input.checked;
      input.checked = false;
    }
    else if( input.type != "submit" ) {
      book[input.name] = input.value;
      input.value = "";
    }
  });

  library.push( new Book( book.title,
                          book.author,
                          Number(book.length),
                          book.read ));
  renderLibrary();
  document.getElementById("new-book").checked = false;
}


window.addEventListener( "load", renderLibrary )

document.getElementById("select-all").addEventListener("change", e => {
  document.querySelectorAll(".selection")
          .forEach(box => {box.checked = e.target.checked;});
  highlightSelectedRows();
});

document.getElementById("delete-selected").addEventListener("click", () => {
  let indices = [];
  document.querySelectorAll(".selection:checked").forEach( item => {
    indices.push( Number(item.getAttribute("data-row")) );
  });

  for(const index of indices) delete( library[index] );
  library = library.filter( e => e );

  renderLibrary();
});

document.getElementById("invert-selection").addEventListener("click", () => {
  document.querySelectorAll(".selection").forEach( box => {
    box.checked = !box.checked;
  });
  highlightSelectedRows();
  setMasterCheckbox();
});

document.getElementById("save-library").addEventListener("click", () => {
  alert("no");
});
