import { useEffect, useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import getData from '../../utils/AsyncStorage/getData';
import profilePicture from '../../assets/DELAF.png';
import { vh, vw } from '../../styles/dimensions/dimensions';
import getAge from '../../utils/functions/getAge';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import getUserData from '../../utils/functions/api/get/getUserData';
import mergeData from '../../utils/AsyncStorage/mergeItem';

export default function Home() {
	const [userData, setUserData] = useState({});
	const user = useSelector((state) => state.user);

	const fetch = async () => {
		const user = await getData('user');
		if (user.error)
			return Toast.show({
				type: 'error',
				text1: 'Ocurrió un error cargando tus datos.',
				text2: 'Por favor cierra sesión y vuelve a iniciar.',
			});
		const res = await getUserData(user._id);
		if (res.error)
			return Toast.show({
				type: 'error',
				text1: 'Ocurrió un error en el servidor.',
				text2: 'Por favor contactese con nostros.',
			});
		mergeData('user', res.data);
		setUserData(user);
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<View
				style={{
					width: 80 * vw,
					paddingVertical: 40,
					marginBottom: 5,
					borderRadius: 5,
					backgroundColor: '#000',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Image
					style={{
						width: 250,
						height: 200,
						borderRadius: 100,
					}}
					source={profilePicture}
					alt='Profile picture'
				/>
				<Text
					style={{
						color: '#f6f6f6',
						fontSize: 14,
						opacity: 0.75,
						marginVertical: 5,
					}}
				>
					Bienvenido
				</Text>
				<Text style={{ color: '#f6f6f6', fontSize: 24 }}>
					{userData.name}
				</Text>
				<Text
					style={{ color: '#f6f6f6', fontSize: 18 }}
				>{`${userData.city}, ${userData.country}`}</Text>
			</View>
			<View
				style={{
					width: 80 * vw,
					flexDirection: 'row',
					justifyContent: 'space-around',
					marginTop: 10,
				}}
			>
				<View style={{ alignItems: 'center' }}>
					<Text>EDAD</Text>
					<Text>{`${getAge(
						new Date(userData.birthday).getTime()
					)} años`}</Text>
				</View>
				<View style={{ alignItems: 'center' }}>
					<Text>ALTURA</Text>
					<Text>{`${userData.height} cm`}</Text>
				</View>
				<View style={{ alignItems: 'center' }}>
					<Text>PESO</Text>
					<Text>{`${userData.weight} kg`}</Text>
				</View>
			</View>
		</View>
	);
}
