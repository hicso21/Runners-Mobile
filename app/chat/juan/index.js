import { Entypo, EvilIcons, Ionicons } from '@expo/vector-icons';
import {
	FlatList,
	KeyboardAvoidingView,
	SafeAreaView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { vw } from '../../../styles/dimensions/dimensions';
import { useEffect, useRef, useState } from 'react';
import getData from '../../../utils/AsyncStorage/getData';
import io from 'socket.io-client';
import UserMessageBubble from '../../../components/UserMessageBubble';
import { FlashList } from '@shopify/flash-list';

let socket;

export default function JuanChat() {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [userData, setUserData] = useState({});
	const flashlist = useRef(null);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (message == '') return;
		const newMessage = {
			message: message.trim(),
			user_id: userData?._id,
			is_user: true,
			name: userData?.name,
		};
		setMessage('');
		socket.emit('user chat', newMessage);
	};

	const receiveMessage = (message, serverOffset) => {
		setMessages((state) => [...state, message]);
		socket.auth.serverOffset = message.createdAt;
	};

	const fetch = async () => {
		const user = await getData('user');
		socket = io('https://delaf.click', {
			auth: {
				user_id: user._id,
				serverOffset: 0,
			},
		});
		setUserData(user);
	};

	useEffect(() => {
		fetch().then(() => socket.on('user chat', receiveMessage));

		return () => {
			socket.off('user chat', receiveMessage);
		};
	}, []);

	useEffect(() => {
		if (messages.length == 0) return;
		flashlist.current.scrollToEnd();
	}, [messages]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={70}
			>
				<View style={styles.entireView}>
					<View style={styles.flatlist}>
						<FlashList
							ref={flashlist}
							estimatedItemSize={200}
							data={messages}
							keyExtractor={(_, index) => index.toString()}
							renderItem={({ item }) => (
								<UserMessageBubble
									item={item}
									userData={userData}
								/>
							)}
							contentContainerStyle={{
								paddingHorizontal: 10,
								paddingVertical: 10,
							}}
							automaticallyAdjustKeyboardInsets
						/>
					</View>
					<View>
						<View style={styles.bottomContainer}>
							<TextInput
								placeholder='Mensaje'
								value={message}
								onChangeText={setMessage}
								style={styles.input}
							/>
							<TouchableOpacity
								onPress={handleSubmit}
								style={styles.buttonContainer}
							>
								<Ionicons name='send' size={40} color='white' />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	entireView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000',
	},
	flatlist: {
		overflow: 'auto',
		height: '92%',
		width: '100%',
		marginBottom: 5,
		backgroundColor: '#f6f6f6',
	},
	bottomContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: 100 * vw,
		paddinBottom: 10,
	},
	buttonContainer: {
		width: 40,
		height: 40,
	},
	input: {
		height: 40,
		borderRadius: 5,
		backgroundColor: '#f6f6f6',
		width: 100 * vw - 130 + 40,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
});
