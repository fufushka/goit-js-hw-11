import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPhotos } from './js/photoApi';
const lightbox = new SimpleLightbox('.lightbox', {
  delay: 250,
});

const refs = {
  form: document.querySelector('.search-form'),
  cards: document.querySelector('.cards'),
  paginationBtn: document.querySelector('.button-89'),
  lightbox: document.querySelector('.lightbox'),
};
let page = 0;
let searchQuery = '';

refs.form.addEventListener('submit', onSubmitForm);

refs.paginationBtn.addEventListener('click', paginationOnBtnClick);

async function onSubmitForm(event) {
  refs.paginationBtn.classList.add('is-hidden');
  event.preventDefault();
  page = 0;
  refs.cards.innerHTML = '';
  try {
    searchQuery = event.target.elements.searchQuery.value.trim();

    if (searchQuery === '') {
      Notiflix.Notify.warning('Enter valid query');
      return;
    }
    const photos = await searchImages();

    if (photos.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    refs.paginationBtn.classList.remove('is-hidden');
    const markup = generateMarkup(photos);
    refs.cards.innerHTML = markup;

    Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure(error);
    console.log(error);
  } finally {
    refs.form.reset();
  }
}

async function paginationOnBtnClick() {
  const photos = await searchImages();
  const markup = generateMarkup(photos);
  appendNewToPhotos(markup);
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
        <li class="cards__item">
         
         <div class="card">
           <a href="${largeImageURL}" class="lightbox">
            <img src="${webformatURL}" alt="" loading="lazy" />
             </a>
            <div class="info">
              <p class="info-item">
                <b>likes:</br>${likes}</b>
              </p>
              <p class="info-item">
                 <b>views:</br>${views}</b>
              </p>
              <p class="info-item">
                 <b>comments:</br>${comments}</b>
              </p>
               
              <p class="info-item">
                 <b>downloads:</br>${downloads}</b>
              </p>
              <p class="info-item">
                 <b>tags:</br>${tags}</b>
              </p>
            </div>
          </div>
         
        </li>
      

    `;
}

async function searchImages() {
  page += 1;
  return await getPhotos(searchQuery, page);
}

function generateMarkup(photos) {
  const markup = photos.hits.reduce(
    (markup, currentPhoto) => markup + createMarkup(currentPhoto),
    ''
  );

  const maxPage = Math.ceil(photos.totalHits / 40);
  console.log(maxPage);
  const nextPage = page + 1;
  console.log(nextPage);
  if (nextPage > maxPage) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    refs.paginationBtn.classList.add('is-hidden');

    // return markup;
  }
  return markup;
}

function appendNewToPhotos(markup) {
  refs.cards.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  scrollPage();
}

function scrollPage() {
  const { height: cardHeight } =
    refs.cards.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
