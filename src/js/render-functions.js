const gallery = document.querySelector('#gallery');

export function renderGallery(images) {
  const markup = images
    .map(
      image => `
      <a href="${image.largeImageURL}" class="gallery-item">
        <img src="${image.webformatURL}" alt="${image.tags}" />
        <div class="info">
          <span><strong>Likes:</strong> ${image.likes}</span>
          <span><strong>Views:</strong> ${image.views}</span>
          <span><strong>Comments:</strong> ${image.comments}</span>
          <span><strong>Downloads:</strong> ${image.downloads}</span>
        </div>
      </a>
    `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function toggleLoader(show) {
  document.querySelector('#loader').style.display = show ? 'block' : 'none';
}

export function smoothScroll() {
  window.scrollBy({ top: 400, behavior: 'smooth' });
}
