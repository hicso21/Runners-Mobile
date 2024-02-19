import { Entypo } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';
import logo from '../../../assets/DELAF.png';
import audioSource from '../../../assets/test.wav';
import { vh, vw } from '../../../styles/dimensions/dimensions';
import getAudios from '../../../utils/functions/api/get/getAudios';
import fromMillisecondsToTime from '../../../utils/functions/fromMillisecondsToTime';

/* 
		name: String,
		description: String,
		src: String,
*/

const ModalContent = ({ open }) => {
	return (
		<View
			style={{
				width: 100 * vw,
				height: 94 * vh,
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				position: 'absolute',
				justifyContent: 'center',
				alignItems: 'center',
				display: open ? 'flex' : 'none',
				zIndex: 999,
			}}
		>
			<View
				style={{
					width: 90 * vw,
					aspectRatio: 16 / 9,
					backgroundColor: '#f6f6f6',
					position: 'absolute',
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 10,
				}}
			>
				<ActivityIndicator size={'large'} color={'#000'} />
				<Text>Aguarda un momento.</Text>
			</View>
		</View>
	);
};

const RenderItem = ({ index, audios }) => {
	const [item, setItem] = useState({});
	const [sound, setSound] = useState(null);
	const [state, setState] = useState('');
	const [open, setOpen] = useState(true);
	const [duration, setDuration] = useState(0);
	const [position, setPosition] = useState(0);
	const [currentTime, setCurrentTime] = useState('00:00');
	const [totalTime, setTotalTime] = useState('00:00');
	const navigation = useNavigation();

	const playSound = async () => {
		if (position == 0) {
			console.log('playing');
			setState('playing');
			await sound?.playAsync();
		} else {
			console.log('playing');
			setState('playing');
			await sound?.playFromPositionAsync(position);
		}
	};

	const pauseSound = async () => {
		if (state != 'playing')
			return Toast.show({
				type: 'info',
				text1: 'El audio ya se encuentra pausado',
			});
		console.log('paused');
		await sound?.pauseAsync();
		setState('paused');
	};

	const stopSound = async () => {
		if (state == 'stoped')
			return Toast.show({
				type: 'info',
				text1: 'El audio ya se encuentra pausado',
			});
		if (state == '')
			return Toast.show({
				type: 'info',
				text1: 'El audio aún no comenzó',
			});
		console.log('stoped');
		await sound?.stopAsync();
		setState('stoped');
	};

	const fetch = async () => {
		setItem(audios[index]);
		const { sound } = await Audio.Sound.createAsync(audios[index]?.src);
		sound.setOnPlaybackStatusUpdate((status) => {
			setDuration(status.durationMillis);
			setPosition(status.positionMillis);
			setTotalTime(fromMillisecondsToTime(status.durationMillis));
			setCurrentTime(fromMillisecondsToTime(status.positionMillis));
		});
		setSound(sound);
		setOpen(false);
	};

	useEffect(() => {
		fetch();
	}, []);

	useEffect(() => {
		sound?.stopAsync();
	}, [index]);

	useEffect(() => {
		return sound
			? () => {
					console.log('Deteniendo sonido');
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	return (
		<>
			<ModalContent open={open} />
			<View style={styles.itemContainer}>
				<View style={styles.visualContent}>
					<Image source={logo} style={styles.image} />
				</View>
				<View style={styles.controller}>
					{state != 'playing' ? (
						<TouchableOpacity
							style={styles.controllerBtns}
							onPress={playSound}
						>
							<Entypo
								name='controller-play'
								size={35}
								color='#f6f6f6'
							/>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							style={styles.controllerBtns}
							onPress={pauseSound}
						>
							<Entypo
								name='controller-paus'
								size={35}
								color='#f6f6f6'
							/>
						</TouchableOpacity>
					)}
					<TouchableOpacity
						style={styles.controllerBtns}
						onPress={stopSound}
					>
						<Entypo
							name='controller-stop'
							size={35}
							color='#f6f6f6'
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.textContainer}>
					<Text style={styles.itemText}>{item?.name}</Text>
					<Text
						style={styles.timer}
					>{`${currentTime}/${totalTime}`}</Text>
				</View>
			</View>
		</>
	);
};

export default function () {
	const [audios, setAudios] = useState([
		{ name: 'Testing', src: audioSource },
		{ name: 'Testing2', src: audioSource },
	]);
	const [index, setIndex] = useState(0);

	const fetch = async () => {
		const { data, error } = await getAudios();
		if (error)
			return Toast.show({
				type: 'error',
				text1: 'Ocurrió un error, por favor contáctanos.',
			});
		if (data.length) setAudios(data);
		else Toast.show({ type: 'info', text1: 'Aún no hay videos' });
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
		<View style={styles.view}>
			<Carousel
				width={100 * vw}
				height={`calc(${100 * vh} - ${6.2 * vh})`}
				data={audios}
				onSnapToItem={(index) => setIndex(index)}
				renderItem={() => <RenderItem audios={audios} index={index} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	visualContent: {
		marginTop: 'auto',
	},
	image: {
		aspectRatio: 1,
		width: 90 * vw,
		height: 90 * vw,
		objectFit: 'contain',
	},
	itemContainer: {
		flex: 1,
		borderWidth: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#000',
	},
	controller: {
		flexDirection: 'row',
		gap: 20,
		height: 70,
		backgroundColor: '',
		alignItems: 'center',
		marginTop: 'auto',
		position: 'relative',
	},
	controllerBtns: {
		borderWidth: 1,
		borderColor: '#f6f6f6',
		borderRadius: 100,
		padding: 10,
	},
	slider: {
		height: 40,
	},
	textContainer: {
		borderTopColor: '#f6f6f6',
		borderTopWidth: 1,
		width: 100 * vw,
		marginTop: 10,
		paddingVertical: 10,
		backgroundColor: '#000',
		gap: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	itemText: {
		textAlign: 'center',
		fontSize: 24,
		color: '#f6f6f6',
	},
	timer: {
		textAlign: 'center',
		fontSize: 18,
		color: '#f6f6f6',
	},
	video: {
		width: '100%',
		height: 'auto',
		aspectRatio: 16 / 10,
	},
});
