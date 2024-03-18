import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Avatar, Card, Modal, Portal } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import logo from '../../assets/DELAF.png';
import getData from '../../utils/AsyncStorage/getData';
import getUserData from '../../utils/functions/api/get/getUserData';
import calendarItemsFormating from '../../utils/functions/calendarItemsFormating';
import toYYYYMMDD from '../../utils/functions/toYYYYMMDDFormat';
import estiramientos from '../../assets/estiramientos.mp4';
import movilidad_articular from '../../assets/movilidad_articular.mp4';
import tecnica_de_carrera from '../../assets/tecnica_de_carrera.mp4';
import { vw } from '../../styles/dimensions/dimensions';
import { ResizeMode, Video } from 'expo-av';

const timeToString = (time) => {
	const date = new Date(time);
	return date.toISOString().split('T')[0];
};

export default function Schedule() {
	const [selected, setSelected] = useState({
		dateString: timeToString(Date.now()),
		day: new Date().getDate(),
		month: new Date().getMonth(),
		timestamp: Date.now(),
		year: new Date().getFullYear(),
	});
	const [items, setItems] = useState({});
	const [userData, setUserData] = useState({});
	const [currentDate, setCurrentDate] = useState(toYYYYMMDD());
	const [modal, setModal] = useState({
		open: false,
		content: estiramientos,
	});
	const router = useRouter();

	// const loadItems = (day) => {
	// 	setItems(
	// 		calendarItemsFormating(
	// 			res.data?.calendar?.routines,
	// 			res.data?.calendar?.races
	// 		)
	// 	);
	// };

	const emptyDay = () => {
		return (
			<View
				style={{
					width: '100%',
					height: 'auto',
					flexDirection: 'row',
					alignItems: 'center',
					paddingRight: 10,
					paddingLeft: 0,
				}}
			>
				<View
					style={{
						alignItems: 'center',
						width: '18%',
					}}
				>
					<Text
						style={{
							fontFamily: 'System',
							color: '#7a92a5',
							fontSize: 28,
						}}
					>
						{selected?.day}
					</Text>
					<Text
						style={{
							fontFamily: 'System',
							color: '#7a92a5',
							fontSize: 14,
						}}
					>
						{
							new Date(selected?.dateString)
								.toGMTString()
								.split(',')[0]
						}
					</Text>
				</View>
				<View
					style={{
						height: 96,
						width: `82%`,
						marginTop: 20,
						borderRadius: 5,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Text>Aún no tienes actividades para este día</Text>
				</View>
			</View>
		);
	};

	const renderItem = (item) => {
		const handlePress = () => {
			if (item?.date) router.push(`/activities/${item?.date}`);
			else Alert.alert('', JSON.stringify(item));
		};

		return (
			<TouchableOpacity
				onPress={handlePress}
				style={{
					marginRight: 10,
					marginTop: 17,
				}}
			>
				<Card style={{ backgroundColor: '#ccc' }}>
					<Card.Content>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Text style={{ fontSize: 18 }}>{item?.name}</Text>
							<Avatar.Image
								style={{ backgroundColor: '#000' }}
								source={logo}
							/>
						</View>
					</Card.Content>
				</Card>
			</TouchableOpacity>
		);
	};

	const fetch = async () => {
		const user = await getData('user');
		const { data, error } = await getUserData(user._id);
		if (error)
			return Toast.show({
				type: 'error',
				text1: 'Ocurrió un error en el servidor.',
				text2: 'Por favor contactese con nostros.',
			});
		console.log(
			calendarItemsFormating(
				data?.data?.calendar?.routines,
				data?.data?.calendar?.races
			)
		);
		setItems(
			calendarItemsFormating(
				data?.data?.calendar?.routines,
				data?.data?.calendar?.races
			)
		);
		setUserData(data?.data);
	};

	useFocusEffect(
		useCallback(() => {
			fetch();
		}, [])
	);

	return (
		<>
			<Portal>
				<Modal
					visible={modal.open}
					onDismiss={() => {
						setModal({ open: false, content: modal.content });
					}}
				>
					<View
						style={{
							backgroundColor: 'white',
							maxWidth: 90 * vw,
							marginHorizontal: 5 * vw,
						}}
					>
						<Video
							// onLoadStart={() => {
							// 	// start loading
							// 	setOpen(true);
							// }}
							// onLoad={() => {
							// 	// finish load
							// 	setOpen(false);
							// }}
							style={{
								width: '100%',
								height: 'auto',
								aspectRatio: 16 / 28,
								backgroundColor: '#000',
							}}
							source={modal.content}
							resizeMode={ResizeMode.CONTAIN}
							useNativeControls
						/>
					</View>
				</Modal>
			</Portal>
			<View style={{ flex: 1 }}>
				<View
					style={{
						height: 30,
						overflow: 'scroll',
						flexDirection: 'row',
						width: 100 * vw,
						justifyContent: 'space-around',
						alignItems: 'center',
					}}
				>
					<TouchableOpacity
						style={{
							borderWidth: 1,
							borderColor: '#000',
							paddingHorizontal: 5,
							paddingVertical: 2,
							borderRadius: 15,
						}}
						onPress={() => {
							setModal({
								open: true,
								content: estiramientos,
							});
						}}
					>
						<Text>Estiramientos</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							borderWidth: 1,
							borderColor: '#000',
							paddingHorizontal: 5,
							paddingVertical: 2,
							borderRadius: 15,
						}}
						onPress={() => {
							setModal({
								open: true,
								content: movilidad_articular,
							});
						}}
					>
						<Text>Movilidad articular</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							borderWidth: 1,
							borderColor: '#000',
							paddingHorizontal: 5,
							paddingVertical: 2,
							borderRadius: 15,
						}}
						onPress={() => {
							setModal({
								open: true,
								content: tecnica_de_carrera,
							});
						}}
					>
						<Text>Tecnica de carrera</Text>
					</TouchableOpacity>
				</View>
				<Agenda
					style={{
						width: '100%',
						height: '100%',
					}}
					items={items}
					pastScrollRange={0}
					minDate={currentDate}
					renderItem={renderItem}
					renderEmptyData={emptyDay}
					onDayPress={(day) => setSelected(day)}
					// hideKnob={true}
					// theme={{
					// 	backgroundColor: 'red',
					// }}
					// loadItemsForMonth={loadItems}
				/>
			</View>
		</>
	);
}
