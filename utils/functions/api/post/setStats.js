import fetchApi from '../../../constants/fetchApi';

export default async function setStats(brand, id) {
	return await fetchApi
		.post(`/${brand}/setStats`, {
			id,
			start_time: Date.now() - 28800,
			end_time: Date.now(),
		})
		.then((res) => res.data)
		.catch((error) => error);
}
