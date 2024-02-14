import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Avatar, Card } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import logo from '../../assets/DELAF.png';
import getData from '../../utils/AsyncStorage/getData';
import getUserData from '../../utils/functions/api/get/getUserData';
import mergeData from '../../utils/AsyncStorage/mergeItem';
import toYYYYMMDD from '../../utils/functions/toYYYYMMDDFormat';
import calendarItemsFormating from '../../utils/functions/calendarItemsFormating';
import { useRouter } from 'expo-router';

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
		const res = await getUserData(user._id);
		if (res.error)
			return Toast.show({
				type: 'error',
				text1: 'Ocurrió un error en el servidor.',
				text2: 'Por favor contactese con nostros.',
			});
		setItems(
			calendarItemsFormating(
				res.data?.calendar?.routines,
				res.data?.calendar?.races
			)
		);
		setUserData(res.data);
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
		<View style={{ flex: 1 }}>
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
	);
}
