import { Entypo, EvilIcons, Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	Alert,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import io from 'socket.io-client';
import GlobalMessageBubble from '../../../components/GlobalMessageBubble';
import { vw } from '../../../styles/dimensions/dimensions';
import getData from '../../../utils/AsyncStorage/getData';
import { FlashList } from '@shopify/flash-list';

let socket;

export default function GlobalChat() {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [userData, setUserData] = useState({});
	const [messagesSelected, setMessagesSelected] = useState([]);
	const flashlist = useRef(null);

	const receiveMessage = useCallback((message) => {
		setMessages((state) => [...state, message]);
		socket.auth.serverOffset = message.createdAt;
	}, []);

	const handleSubmit = (event) => {
		console.log('user_id => ', userData._id)
		if (message == '') return;
		const newMessage = {
			message: message.trim(),
			from: userData.name,
			user_id: userData._id,
			on_response: {},
		};
		setMessage('');
		socket.emit('global chat', newMessage);
	}

	const fetch = async () => {
		const user = await getData('user');
		socket = io('https://delaf.click', {
			auth: {
				username: user.name,
				serverOffset: 0,
			},
		});
		setUserData(user);
	};

	useEffect(() => {
		fetch().then(() => socket.on('global chat', receiveMessage));

		return () => {
			socket.off('global chat', receiveMessage);
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
				keyboardVerticalOffset={60}
			>
				<View style={styles.entireView}>
					<View style={styles.flatlist}>
						<FlashList
							ref={flashlist}
							estimatedItemSize={200}
							data={messages}
							keyExtractor={(_, index) => index.toString()}
							renderItem={({ item }) => (
								<GlobalMessageBubble
									item={item}
									userData={userData}
									messagesSelected={messagesSelected}
									setMessagesSelected={setMessagesSelected}
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
							{/* <TouchableOpacity style={styles.buttonContainer}>
								<Entypo name='user' size={40} color='white' />
							</TouchableOpacity> */}
							<TextInput
								placeholder='Mensaje'
								value={message}
								onChangeText={setMessage}
								style={styles.input}
							/>
							{/* <TouchableOpacity style={styles.buttonContainer}>
								<EvilIcons
									name='calendar'
									size={50}
									color='white'
								/>
							</TouchableOpacity> */}
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
	},
	buttonContainer: {
		width: 40,
		height: 40,
	},
	input: {
		height: 40,
		borderRadius: 5,
		backgroundColor: '#f6f6f6',
		width: 100 * vw - 170 + 80,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
});
