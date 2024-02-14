import { useFocusEffect, useRouter } from 'expo-router';
import { Image, Text, View } from 'react-native';
import logo from '../assets/DELAF.png';

export default function Page() {
	const router = useRouter();

	const fetch = () => {
		router.replace('/redirect');
	};

	useFocusEffect(() => {
		fetch();
	});

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#000',
			}}
		>
			<View style={{ aspectRatio: 1, width: 250 }}>
				<Image
					source={logo}
					style={{ width: '100%', height: '100%', borderRadius: 10 }}
				/>
			</View>
			<Text style={{ color: '#f6f6f6', fontSize: 18 }}>Cargando...</Text>
		</View>
	);
}
