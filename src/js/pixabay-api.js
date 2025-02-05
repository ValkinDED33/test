import axios from 'axios';

const API_KEY = '48211039-b5a5e94b0d08467a34362de56';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(
  query,
  page = 1,
  category = '',
  colors = '',
  imageType = 'all',
  perPage = 29
) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: imageType,
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage, // ✅ Фікс: передаємо `per_page` без помилки
  };

  if (category) params.category = category;
  if (colors) params.colors = colors;

  try {
    const response = await axios.get(BASE_URL, { params, timeout: 10000 });

    if (response.data.hits.length > perPage) {
      response.data.hits = response.data.hits.slice(0, perPage); // ✅ Гарантуємо рівно 29 результатів
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error.message || error);
    throw new Error('Failed to fetch images.');
  }
}
