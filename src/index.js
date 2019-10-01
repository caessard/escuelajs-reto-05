const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const characters = response.results;
      if(response.info.next === ''){
        localStorage.removeItem('next_fetch')
        localStorage.setItem('last_page', true)
      }
      localStorage.setItem('next_fetch', response.info.next)
      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
}

/**
 * Works the async - await in that function but I think is not a correct implementation in loadData
 */
const loadData = async () =>  {
  if('next_fetch' in localStorage) {
    let next_fetch = localStorage.getItem('next_fetch')
    await getData(next_fetch) 
  } else {
    await getData(API)
  }
}

const intersectionObserver = new IntersectionObserver(entries => {
  debugger
  if (entries[0].isIntersecting && 'last_page' in localStorage && !localStorage.getItem('last_page')) {
    loadData();
  } else {
    let newItem = document.createElement('h1');
    newItem.innerHTML = 'Ya no hay personajes';
    $app.appendChild(newItem);
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);

if (sessionStorage.getItem("is_reloaded")) {
  localStorage.removeItem('next_fetch')
  localStorage.removeItem('last_page')
}