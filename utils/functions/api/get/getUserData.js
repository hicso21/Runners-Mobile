import fetchApi from '../../../constants/fetchApi';

export default async function getUserData(id) {
	const { data } = await fetchApi.get(`/runners/getById/${id}`);
	return data;
}
