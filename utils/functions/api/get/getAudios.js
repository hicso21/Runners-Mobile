import fetchApi from '../../../constants/fetchApi';

export default async function getAudios() {
	const { data } = await fetchApi.get('/uploads/multimedia/getAudios');
	return data ?? false;
}
