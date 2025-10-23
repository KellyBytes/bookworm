res.data

.items: Array(10)
 ├─ accessInfo: {country: 'CA', ...}
 ├─ etag: 'pIVJkoaAXBc'
 ├─ id: 'KQbEAAAQBAJ'
 ├─ kind: 'books#volume'
 ├─ saleInfo:
 │   ├─ buyLink: 'https://play.google.com/store/books/...'
 │   ├─ country: 'CA'
 │   └─ listPrice: {amount: 84.99, currencyCode: 'CAD'}
 ├─ searchInfo:
 │   └─ textSnippet: 'By the end of this book, you'll...'
 ├─ selfLink: "https://www.googleapis.com/books/v1/volumes/0KQbEAAAQBAJ"
 └─ volumeInfo
     ├─ authors: (2) ['Majid M. Heravi', 'Vahideh Zadsirjan']
     ├─ canonicalVolumeLink: "https://play.google.com/store/books/..."
     ├─ categories: ["Science"]
     ├─ description: "Recent Applications of Selected Name Reactions..."
     ├─ imageLinks:
     │   ├─ smallThumbnail: 'http://books.google.com/books/content?id=0KQbEAAAQ．．．', 
     │   └─ thumbnail: 'http://books.google.com/books/content?id=0KQbEAAAQ...'
     ├─ previewLink: "http://books.google.ca/books?id=0KQbEAAAQBAJ..."
     ├─ printType: "BOOK"
     ├─ publishedDate: "2021-06-12"
     ├─ publisher: "Elsevier"
     └─ title: "Recent Applications of Selected Name Reactions in the Total Synthesis of Alkaloids"

---

You can perform a volumes search by sending an HTTP GET request to the following URI:

https://www.googleapis.com/books/v1/volumes?q=search+terms

`q` - Search for volumes that contain this text string. There are special keywords you can specify in the search terms to search in particular fields, such as:

`intitle`: Returns results where the text following this keyword is found in the title.

`inauthor`: Returns results where the text following this keyword is found in the author.

`inpublisher`: Returns results where the text following this keyword is found in the publisher.

`subject`: Returns results where the text following this keyword is listed in the category list of the volume.

`isbn`: Returns results where the text following this keyword is the ISBN number.

`lccn`: Returns results where the text following this keyword is the Library of Congress Control Number.

`oclc`: Returns results where the text following this keyword is the Online Computer Library Center number.


Here is an example of searching for Daniel Keyes’ “Flowers for Algernon”:

GET https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=yourAPIKey
