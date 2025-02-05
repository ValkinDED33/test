import { fetchImages } from './js/pixabay-api.js';
import {
  renderGallery,
  clearGallery,
  smoothScroll,
} from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let query = '';
let page = 1;
const perPage = 29;
const loader = document.getElementById('loader');
const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more');
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('#search-input');

let loadedImageIds = new Set();
const lightbox = new SimpleLightbox('.gallery a', { scrollZoom: false }); // ✅ Створюємо один раз

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

async function loadImages(reset = false) {
  if (reset) {
    page = 1;
    clearGallery();
    loadedImageIds.clear();
    loadMoreBtn.classList.add('hidden');
  } else {
    page += 1;
  }

  showLoader();

  try {
    const data = await fetchImages(query, page, '', '', 'all', perPage);
    hideLoader();

    if (!data || !data.hits || data.hits.length === 0) {
      iziToast.warning({
        title: 'Warning',
        message: 'Nothing found! Try another search.',
      });
      return;
    }

    const uniqueImages = data.hits.filter(
      image => !loadedImageIds.has(image.id)
    );
    uniqueImages.forEach(image => loadedImageIds.add(image.id));

    renderGallery(uniqueImages);
    lightbox.refresh(); // ✅ Оновлюємо Lightbox замість створення нового

    if (data.totalHits > page * perPage) {
      loadMoreBtn.classList.remove('hidden'); // ✅ Фікс відображення кнопки "Load More"
    } else {
      loadMoreBtn.classList.add('hidden');
    }

    if (!reset) smoothScroll();
  } catch (error) {
    console.error('Error loading images:', error);
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again.',
    });
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  query = searchInput.value.trim();
  if (!query) {
    iziToast.info({ title: 'Info', message: 'Please enter a search query!' });
    return;
  }
  loadImages(true);
});

loadMoreBtn.addEventListener('click', () => loadImages(false));
