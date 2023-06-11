import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

const API_KEY = '37180259-a7b74ce7fbdff4a67e50e8712';

export async function getPhotos(query, page) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  const response = await axios.get(url);

  return response.data;
}
