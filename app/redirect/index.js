import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import logo from '../../assets/DELAF.png';
import getData from '../../utils/AsyncStorage/getData';

export default function Temp() {
	const router = useRouter();

	const fetch = async () => {
		const user = await getData('user');
		console.log('redirect => ', user);
		if (user?.email) router.replace('/home');
		else router.replace('/login');
	};

	const redirectToRegister = () => router.replace('/register');
	const redirectToMarchView = () => router.replace('/marchView');

	useFocusEffect(
		useCallback(() => {
			fetch();
		}, [])
	);

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
			<View
				style={{
					flexDirection: 'row',
					marginTop: 20,
					width: '100%',
					justifyContent: 'space-around',
				}}
			>
				<TouchableOpacity onPress={redirectToRegister}>
					<View
						style={{
							paddingVertical: 10,
							paddingHorizontal: 15,
							borderRadius: 5,
							borderWidth: 1,
							borderColor: '#f6f6f6',
						}}
					>
						<Text style={{ color: '#f6f6f6', fontSize: 18 }}>
							Ingresar código
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={redirectToMarchView}>
					<View
						style={{
							paddingVertical: 10,
							paddingHorizontal: 15,
							borderRadius: 5,
							borderWidth: 1,
							borderColor: '#f6f6f6',
						}}
					>
						<Text style={{ color: '#f6f6f6', fontSize: 18 }}>
							No tengo código
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}
