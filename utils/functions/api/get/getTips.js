import fetchApi from '../../../constants/fetchApi';

export default async function getTips() {
	const { data } = await fetchApi.get('/uploads/multimedia/getTips');
	return data ?? false;
}
