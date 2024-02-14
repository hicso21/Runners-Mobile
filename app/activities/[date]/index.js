import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import getData from '../../../utils/AsyncStorage/getData';
import { FlashList } from '@shopify/flash-list';
import { vh, vw } from '../../../styles/dimensions/dimensions';
import { namesDefinitions } from '../../../utils/constants/names';
import { rythmsDefinitions } from '../../../utils/constants/rythms';
import toSeeMeasure from '../../../utils/functions/toSeeMeasure';
import getGifsByList from '../../../utils/functions/api/get/getGifsByList';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function Activity() {
	const { date } = useLocalSearchParams();
	const [routine, setRoutine] = useState({});
	const [exercises, setExercises] = useState([]);
	const [gifs, setGifs] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [gifSelected, setGifSelected] = useState('');

	const onClose = () => setIsOpen(false);

	const fetch = async () => {
		const user = await getData('user');
		const gifs_id = user.calendar.routines
			.find((item) => item.start.includes(date))
			.resource.exercises.map((item) => item.gif_id)
			.filter((item) => item);
		const { data } = await getGifsByList(gifs_id);
		setGifs(data);
		setRoutine(
			user.calendar.routines.find((item) => item.start.includes(date))
		);
		setExercises(
			user.calendar.routines.find((item) => item.start.includes(date))
				.resource.exercises
		);
	};

	const itemToRender = ({ item, index }) => {
		const isFirstRepeat =
			exercises[index - 1]?.repeat == 1 && item?.repeat > 1;
		const isLastRepeat =
			exercises[index + 1]?.repeat == 1 && item?.repeat > 1;
		const isMidRepeat =
			exercises[index + 1]?.repeat > 1 &&
			exercises[index - 1]?.repeat > 1 &&
			item?.repeat > 1;

		const handleSeeGif = () => {
			if (!item.gif_id)
				return Toast.show({
					type: 'info',
					text1: 'Este item no contiene un gif para ver.',
				});
			setGifSelected(item.gif_id);
			setIsOpen(true);
		};

		return item?.repeat > 1 ? (
			<View
				style={{
					height: isFirstRepeat ? 90 : isLastRepeat ? 70 : 60,
					marginTop: isFirstRepeat ? 10 : 0,
					flexDirection: isFirstRepeat ? 'column' : 'row',
					backgroundColor: '#ccc',
					borderTopLeftRadius: isFirstRepeat ? 5 : 0,
					borderTopRightRadius: isFirstRepeat ? 5 : 0,
					borderBottomLeftRadius: isLastRepeat ? 5 : 0,
					borderBottomRightRadius: isLastRepeat ? 5 : 0,
					paddingHorizontal: 10,
					paddingBottom: isLastRepeat ? 10 : 0,
					paddingVertical: 5,
				}}
			>
				{isFirstRepeat && (
					<View
						style={{
							paddingHorizontal: 10,
							height: 30,
							justifyContent: 'center',
						}}
					>
						<Text
							style={{ fontSize: 16 }}
						>{`${item?.repeat} repeticiones`}</Text>
					</View>
				)}
				<TouchableOpacity
					onPress={handleSeeGif}
					style={{
						borderRadius: 5,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						paddingHorizontal: 10,
						width: '100%',
						height: isFirstRepeat ? 55 : '100%',
						backgroundColor: '#f6f6f6',
					}}
				>
					<View
						style={{
							borderRadius: 5,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							paddingHorizontal: 10,
							width: '100%',
							height: isFirstRepeat ? 55 : '100%',
							backgroundColor: '#f6f6f6',
						}}
					>
						<Text style={{ fontSize: 18 }}>
							{`${
								item?.name == 'race'
									? namesDefinitions[item?.type]
									: namesDefinitions[item?.name]
							} - `}
							{toSeeMeasure(item)}
						</Text>
						<Text style={{ fontSize: 18 }}>{`${
							rythmsDefinitions[item?.category]
						} `}</Text>
					</View>
				</TouchableOpacity>
			</View>
		) : (
			<TouchableOpacity onPress={handleSeeGif}>
				<View
					style={{
						height: 50,
						marginTop: 10,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<View
						style={{
							borderRadius: 5,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							paddingHorizontal: 10,
							width: '100%',
							height: '100%',
							// backgroundColor: '#ccc',
							borderBottomColor: '#000',
							borderBottomWidth: 1,
						}}
					>
						<Text style={{ fontSize: 18 }}>
							{`${
								item?.name == 'race'
									? namesDefinitions[item?.type]
									: namesDefinitions[item?.name]
							} - `}
							{toSeeMeasure(item)}
						</Text>
						<Text style={{ fontSize: 18 }}>{`${
							rythmsDefinitions[item?.category]
						} `}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
		<>
			<Modal
				animationType='slide'
				visible={isOpen}
				onRequestClose={onClose}
			>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: '#000',
					}}
				>
					<View
						style={{
							width: '90%',
							height: '70%',
							backgroundColor: '#f6f6f6',
							borderRadius: 5,
							padding: 10,
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<View style={{ width: '100%', alignItems: 'flex-end' }}>
							<TouchableOpacity onPress={onClose}>
								<MaterialIcons
									name='close'
									color='#000'
									size={30}
								/>
							</TouchableOpacity>
						</View>
						<View />
						<View
							style={{
								width: 80 * vw,
								height: 80 * vw,
								backgroundColor: 'red',
							}}
						>
							<Image
								source={{
									uri: gifs.find(
										(item) => item._id == gifSelected
									)?.gif,
								}}
								style={{
									width: '100%',
									height: '100%',
								}}
							/>
						</View>
						<Text style={{ fontSize: 24 }}>
							{gifs.find((item) => item._id == gifSelected)?.name}
						</Text>
						<View />
					</View>
				</View>
			</Modal>
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'space-evenly',
					height: 93.8 * vh,
					width: 100 * vw,
				}}
			>
				<View style={{ height: 5 * vh, justifyContent: 'center' }}>
					<Text style={{ fontSize: 28 }}>
						{routine?.resource?.name}
					</Text>
				</View>
				<View
					style={{
						height: 60 * vh,
						width: 95 * vw,
					}}
				>
					<FlashList
						renderItem={itemToRender}
						data={exercises}
						estimatedItemSize={50}
					/>
				</View>
				<View>
					<TouchableOpacity>
						<Text>Ya completaste tu rutina?</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
}
