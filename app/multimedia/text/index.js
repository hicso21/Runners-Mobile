import { useEffect, useState } from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import getTexts from '../../../utils/functions/api/get/getTexts';
import { vh, vw } from '../../../styles/dimensions/dimensions';
import Carousel from 'react-native-reanimated-carousel';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

/* 
		name: String,
		description: String,
*/

export default function () {
	const [texts, setTexts] = useState([
		{
			name: 'Probando titulo largo a ver como queda',
			description:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus animi at commodi illo praesentium! Aliquam quidem sit dolores. Aliquam libero natus doloribus asperiores quis velit reiciendis porro assumenda enim. Perferendis reiciendis eveniet culpa maxime nihil odio vitae dolore? Deleniti aspernatur odit modi corrupti magnam sed ad animi iusto adipisci ullam asperiores pariatur ex dolore dolor aperiam, minima sit consequatur corporis similique? Enim magni asperiores ad perferendis quod repellendus aperiam nam repudiandae commodi tenetur tempore, eos impedit maiores nulla cum nemo molestiae quibusdam. Voluptate officiis illo veritatis placeat enim ut doloribus aspernatur architecto cum distinctio id, eveniet dignissimos in quas. Error suscipit quasi beatae nisi impedit ut sapiente, unde labore reprehenderit officia a aspernatur eius, consequatur enim perferendis modi dignissimos alias voluptas vitae itaque nobis doloribus voluptate! Fugiat laboriosam repudiandae, blanditiis in harum molestiae ad accusamus. Eaque nemo debitis asperiores, soluta aspernatur fugit, animi at ullam quae rerum delectus maiores dicta.',
		},
		{
			name: 'Tip numero 2',
			description: 'Hola',
		},
		{
			name: 'Tip numero 3',
			description:
				'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus animi at commodi illo praesentium! Aliquam quidem sit dolores. Aliquam libero natus doloribus asperiores quis velit reiciendis porro assumenda enim. Perferendis reiciendis eveniet culpa maxime nihil odio vitae dolore? Deleniti aspernatur odit modi corrupti magnam sed ad animi iusto adipisci ullam asperiores pariatur ex dolore dolor aperiam, minima sit consequatur corporis similique? Enim magni asperiores ad perferendis quod repellendus aperiam nam repudiandae commodi tenetur tempore, eos impedit maiores nulla cum nemo molestiae quibusdam. Voluptate officiis illo veritatis placeat enim ut doloribus aspernatur architecto cum distinctio id, eveniet dignissimos in quas. Error suscipit quasi beatae nisi impedit ut sapiente, unde labore reprehenderit officia a aspernatur eius, consequatur enim perferendis modi dignissimos alias voluptas vitae itaque nobis doloribus voluptate! Fugiat laboriosam repudiandae, blanditiis in harum molestiae ad accusamus. Eaque nemo debitis asperiores, soluta aspernatur fugit, animi at ullam quae rerum delectus maiores dicta.',
		},
	]);
	const [page, setPage] = useState(0);

	const nextPage = () => {
		if (page + 1 == texts.length) setPage(0);
		else setPage((curr) => curr + 1);
	};

	const prevPage = () => {
		if (page == 0) setPage(texts.length - 1);
		else setPage((curr) => curr - 1);
	};

	const fetch = async () => {
		const { data, error } = await getTexts();
		if (error)
			return Toast.show({
				type: 'error',
				text1: 'Ocurrió un error, por favor contáctanos.',
			});
		if (data.length) setTexts(data);
		else Toast.show({ type: 'info', text1: 'Aún no hay videos' });
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
		<View style={styles.view}>
			<View
				style={{
					flex: 1,
					borderWidth: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#000',
				}}
			>
				<View
					style={{
						paddingVertical: 10,
						borderBottomColor: '#f6f6f6',
						borderBottomWidth: 1,
						marginBottom: 3,
						width: 100 * vw,
						alignItems: 'center',
					}}
				>
					<Text style={styles.itemText}>{texts[page]?.name}</Text>
				</View>
				<ScrollView>
					<Text style={styles.itemDescription}>
						{texts[page]?.description}
					</Text>
				</ScrollView>
				<View
					style={{
						flexDirection: 'row',
						width: 100 * vw,
						height: 'auto',
						justifyContent: 'space-around',
						alignItems: 'center',
						paddingVertical: 5,
					}}
				>
					<TouchableOpacity onPress={prevPage}>
						<Feather name='arrow-left' size={30} color='#f6f6f6' />
					</TouchableOpacity>
					<Text style={{ color: '#f6f6f6', fontSize: 18 }}>{`${
						page + 1
					}/${texts.length}`}</Text>
					<TouchableOpacity onPress={nextPage}>
						<Feather name='arrow-right' size={30} color='#f6f6f6' />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 93.8 * vh,
	},
	itemText: {
		textAlign: 'center',
		fontSize: 22,
		color: '#f6f6f6',
		paddingLeft: 5,
	},
	itemDescription: {
		textAlign: 'left',
		fontSize: 18,
		color: '#f6f6f6',
		paddingLeft: 5,
	},
});
