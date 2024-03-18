import fetchApi from '../../../constants/fetchApi';

export default async function routineCompleted(routine_id, user_id, startDate) {
	try {
		const { data } = await fetchApi.post('/routines/routineCompleted', {
			routine_id,
			user_id,
			startDate,
		});
		return {
			error: false,
			data,
		};
	} catch (error) {
		return {
			error: true,
			data: error,
		};
	}
}
