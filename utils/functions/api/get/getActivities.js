import fetchApi from '../../../constants/fetchApi';
import activities from '../../../fakeData/activities';

export default async function getActivities(user_id) {
	try {
		// const { data } = await fetchApi.get(`/activities/getAll/${user_id}`);
		// return data;
		return activities;
	} catch (error) {
		return {
			error: true,
			data: error,
		};
	}
}
