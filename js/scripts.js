//* Hi! New Project
//const apiUrl = 'https://news-api-v2.herokuapp.com';

// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();

const newsService = (function () {
  const apiKey = 'd1140151092a426bb672b40dedba49cd';
  const apiUrl = 'https://news-api-v2.herokuapp.com';

  return {
    tophedlines(country = 'ua', cb) {
      http.get(`${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`,cb);
     },
    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`,cb);
     },
  };
}());

//* Elements
const form = document.forms['newsControls'];
const coutrySelect = form.elements['country'];
const searchInput = form.elements['search'];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadNews();
});

//  init selects
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
  loadNews();
});

//* Load News

function loadNews() {
  showLoader();
  const country = coutrySelect.value;
  const searchText = searchInput.value;
  if (!searchText) {
    newsService.tophedlines(country, onGetResponse); 
  } else {
    newsService.everything(searchText, onGetResponse);
  }
}

//* Function on get rsponse from Server

function onGetResponse(err, res) {
  removePreloader();
  if (err) {
    showAlert(err, 'err-msg');
    return;
  }
  if (!res.articles.length) {
    //show empty message
    return;
  }
  renderNews(res.articles);
}
//* Function render news

function renderNews(news) {
  const newsContainer = document.querySelector('.news-container .row');
  if (newsContainer.children.length) {
    clearContainer(newsContainer);
  }
  let fragment = '';
  news.forEach(newsItem => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });
  newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

//* Function clear container
function clearContainer(container) {
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
  
}

//*News Item template function

function newsTemplate({urlToImage, title, url, description}) {
  //console.log(urlToImage);
  return `
    <div class="col s12">
      <div class="card">
        <div class="card-image">
          <img src="${urlToImage}"/>
          <span class="card-title">${title || ''}</span>
        </div>
        <div class="card-content">
          <p>${description || ''}</p>
        </div>
        <div class="card-action">
          <a href="${url}" target="_blank">Read more...</a>
        </div>
      </div>
    </div>
  `;
}
//* Function Show Message
function showAlert(msg, type = 'success') {
  M.toast({ html: msg, classes: type });
}
//* Show loader fuction
function showLoader() {
  document.body.insertAdjacentHTML('afterbegin', `
  <div class="progress">
      <div class="indeterminate"></div>
  </div>
  `);
}
//* Remove loader function
function removePreloader() {
  const loader = document.querySelector('.progress');
  if (loader) {
    loader.remove();
    return;
  }
}
