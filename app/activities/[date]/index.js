import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	Modal,
	Platform,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Modal as PaperModal, Portal } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { vh, vw } from '../../../styles/dimensions/dimensions';
import getData from '../../../utils/AsyncStorage/getData';
import { namesDefinitions } from '../../../utils/constants/names';
import { rythmsDefinitions } from '../../../utils/constants/rythms';
import getGifsByList from '../../../utils/functions/api/get/getGifsByList';
import routineCompleted from '../../../utils/functions/api/put/routineCompleted';
import toSeeMeasure from '../../../utils/functions/toSeeMeasure';
import toSeeSecondMeasure from '../../../utils/functions/toSeeSecondMeasure';
import getUserData from '../../../utils/functions/api/get/getUserData';
import * as WebBrowser from 'expo-web-browser';
import setStats from '../../../utils/functions/api/post/setStats';

export default function Activity() {
	const { date } = useLocalSearchParams();
	const [routine, setRoutine] = useState({});
	const [exercises, setExercises] = useState([]);
	const [gifs, setGifs] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [gifSelected, setGifSelected] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [confirmation, setConfirmation] = useState(false);
	const [userData, setUserData] = useState({});
	const [pdf, setPdf] = useState('');
	const [pdfModal, setPdfModal] = useState(false);

	const onConfirmationModalOpen = () => setConfirmation(true);
	const onConfirmationModalClose = () => setConfirmation(false);

	const onClose = () => setIsOpen(false);

	const fetch = async () => {
		const user = await getData('user');
		const { data: userDataAPI, error } = await getUserData(user._id);
		const gifs_id = userDataAPI.data.calendar.routines
			.find((item) => item.start.includes(date))
			.resource.exercises.map((item) => item.gif_id)
			.filter((item) => item);
		const { data } = await getGifsByList(gifs_id);
		setGifs(data);
		setRoutine(
			userDataAPI.data.calendar.routines.find((item) =>
				item.start.includes(date)
			)
		);
		if (
			userDataAPI.data.calendar.routines.find((item) =>
				item.start.includes(date)
			)?.resource?.pdf
		)
			setPdf(
				userDataAPI.data.calendar.routines.find((item) =>
					item.start.includes(date)
				)?.resource?.pdf
			);
		setExercises(
			userDataAPI.data.calendar.routines.find((item) =>
				item.start.includes(date)
			).resource.exercises
		);
		setUserData(userDataAPI.data);
		setIsLoading(false);
	};

	const onFinishRoutine = async () => {
		const { data, error } = await setStats(userData.brand, userData._id);
		console.log(data, error);
		if (data?.error)
			return Toast.show({
				type: 'error',
				text1: 'Ocurrió un error, contacta a nuestro equipo',
			});
		if (error)
			return Toast.show({
				type: 'error',
				text1: 'Ocurrió un error, contacta a nuestro equipo',
			});
		Toast.show({
			type: 'success',
			text1: 'La próxima vez que entre a DELAF, podrá ver en estadísticas los datos obtenidos a partir de hoy',
		});
	};

	const downloadPDF = async () => {
		const filename = 'Rutina.pdf'; // Replace with desired filename
		const encodedUrl = encodeURIComponent(
			`<a href="<span class="math-inline">\{${pdf}\}" download\="</span>${filename}">Download PDF</a>`
		);
		await WebBrowser.openBrowserAsync(`data:text/html;${encodedUrl}`);
	};

	const itemToRender = ({ item, index }) => {
		const isFirstRepeat = exercises[index - 1]
			? exercises[index - 1]?.repeat == 1 && item?.repeat > 1
			: item?.repeat > 1;
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
					minHeight: 80,
					marginTop: isFirstRepeat ? 10 : 0,
					flexDirection: isFirstRepeat ? 'column' : 'row',
					backgroundColor: '#ccc',
					borderTopLeftRadius: isFirstRepeat ? 5 : 0,
					borderTopRightRadius: isFirstRepeat ? 5 : 0,
					borderBottomLeftRadius: isLastRepeat ? 5 : 0,
					borderBottomRightRadius: isLastRepeat ? 5 : 0,
					paddingHorizontal: 10,
					paddingBottom: 10,
					paddingVertical: 5,
				}}
			>
				{isFirstRepeat && (
					<View
						style={{
							paddingHorizontal: 10,
							height: 30,
							justifyContent: 'start',
						}}
					>
						<Text
							style={{ fontSize: 16 }}
						>{`Repetir secuencia ${item?.repeat} veces`}</Text>
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
						height: 'calc(100% - 20)',
						backgroundColor: '#f6f6f6',
					}}
				>
					<View
						style={{
							borderRadius: 5,
							flexDirection: 'column',
							justifyContent: 'space-between',
							alignItems: 'center',
							paddingHorizontal: 10,
							width: '100%',
							backgroundColor: '#f6f6f6',
						}}
					>
						<Text style={{ fontSize: 18, textAlign: 'center' }}>
							{item?.name == 'race'
								? namesDefinitions[item?.type]
								: item?.type == 'functional'
								? item?.name
								: namesDefinitions[item?.name]}
						</Text>
						<View
							style={{
								width: '100%',
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingHorizontal: 10,
							}}
						>
							<Text>{toSeeMeasure(item)}</Text>
							<Text style={{ fontSize: 18 }}>
								{item?.category &&
									rythmsDefinitions[item?.category]}
							</Text>
							<Text style={{ fontSize: 18 }}>
								{item?.second_measure &&
									toSeeSecondMeasure(item)}
							</Text>
						</View>
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
							borderBottomColor: '#000',
							borderBottomWidth: 1,
						}}
					>
						<Text style={{ fontSize: 18 }}>
							{`${
								item?.name == 'race'
									? namesDefinitions[item?.type]
									: item?.type == 'functional'
									? item?.name
									: namesDefinitions[item?.name]
							} - `}
							{toSeeMeasure(item)}
						</Text>
						<Text style={{ fontSize: 18 }}>
							{item?.category &&
								rythmsDefinitions[item?.category]}
						</Text>
						<Text style={{ fontSize: 18 }}>
							{item?.second_measure && toSeeSecondMeasure(item)}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	useFocusEffect(
		useCallback(() => {
			fetch();
		}, [])
	);

	return (
		<>
			{/* GIF */}
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
						<View
							style={{
								width: '100%',
								alignItems: 'flex-end',
							}}
						>
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
			{/* Confirmation */}
			<Portal>
				<PaperModal
					visible={confirmation}
					onDismiss={onConfirmationModalClose}
					contentContainerStyle={{
						height: 100 * vh,
						width: 100 * vw,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'transparent',
					}}
				>
					<View
						style={{
							height: 'auto',
							alignItems: 'center',
							paddingVertical: 25,
							paddingHorizontal: 25,
							backgroundColor: '#f6f6f6',
							borderRadius: 5,
							gap: 25,
						}}
					>
						<Text style={{ fontSize: 22 }}>
							Completaste la rutina?
						</Text>
						<View style={{ flexDirection: 'row', gap: 25 }}>
							<TouchableOpacity
								onPress={onConfirmationModalClose}
								style={{
									borderColor: '#000',
									borderWidth: 1,
									borderRadius: 5,
									padding: 10,
								}}
							>
								<Text style={{ color: '#000' }}>Cancelar</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={onFinishRoutine}
								style={{
									backgroundColor: '#000',
									borderRadius: 5,
									padding: 10,
								}}
							>
								<Text style={{ color: '#f6f6f6' }}>
									Confirmar
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</PaperModal>
			</Portal>
			{/* PDF */}
			{/* <Portal>
				<PaperModal
					visible={pdfModal}
					onDismiss={() => setPdfModal(false)}
					contentContainerStyle={{
						height: 100 * vh,
						width: 100 * vw,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'transparent',
					}}
				></PaperModal>
			</Portal> */}
			{/* Content */}
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'space-evenly',
					height: 93.8 * vh,
					width: 100 * vw,
				}}
			>
				{isLoading ? (
					<View
						style={{
							justifyContent: 'center',
						}}
					>
						<ActivityIndicator
							style={{ transform: 'scale(2)' }}
							size={'large'}
							color={'#000'}
						/>
					</View>
				) : (
					<>
						<View
							style={{ height: 5 * vh, justifyContent: 'center' }}
						>
							<Text style={{ fontSize: 28 }}>
								{routine?.resource?.name}
							</Text>
						</View>
						<View
							style={{
								height: 50 * vh,
								width: 95 * vw,
							}}
						>
							<FlashList
								renderItem={itemToRender}
								data={exercises}
								estimatedItemSize={50}
							/>
						</View>
						{/* {pdf && (
							<View>
								<TouchableOpacity onPress={downloadPDF}>
									<Text style={{ color: '#000' }}>
										Ver PDF
									</Text>
								</TouchableOpacity>
							</View>
						)} */}
						<View>
							<TouchableOpacity onPress={onConfirmationModalOpen}>
								<Text>Ya completaste tu rutina?</Text>
							</TouchableOpacity>
						</View>
					</>
				)}
			</View>
		</>
	);
}
