import { useState } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import StatusBar from '../../components/StatusBar';
import { vh, vw } from '../../styles/dimensions/dimensions';
import settingCode from '../../utils/functions/api/post/settingCode';

export default function Recovery() {
	const [email, setEmail] = useState('');

	const handleSendCode = async () => {
		const regexp =
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		if (!email.match(regexp))
			return Toast.show({
				type: 'error',
				text1: 'Revise los caracteres usados',
			});
		const response = await settingCode(email);
		if (response?.data == "This email doesn't exist")
			return Toast.show({
				type: 'error',
				text1: 'Este correo no existe en la base de datos',
			});
		if (response?.data == 'Mail sended')
			return Toast.show({
				type: 'info',
				text1: 'Revisa tu correo electrónico',
			});
		return Toast.show({
			type: 'error',
			text1: 'Ocurrió un error en el servidor, intenta nuevamente',
		});
	};

	return (
		<View style={styles.view}>
			<StatusBar />
			<View style={styles.content}>
				<View>
					<View style={styles.container}>
						<Text style={styles.text}>Email</Text>
						<TextInput
							keyboardType='email-address'
							placeholder='Email'
							textContentType='emailAddress'
							value={email}
							onChangeText={setEmail}
							style={styles.input}
						/>
					</View>
				</View>
				<View style={{ alignItems: 'center' }}>
					<TouchableOpacity
						style={{
							borderColor: '#f6f6f6',
							borderWidth: 1,
							borderRadius: 5,
							paddingVertical: 8,
							paddingHorizontal: 15,
						}}
						onPress={handleSendCode}
					>
						<Text style={{ color: '#f6f6f6' }}>Enviar</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	languageContainer: {
		position: 'absolute',
		top: 10,
		right: 15,
	},
	languageContent: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
	},
	flag: {
		borderRadius: 5,
	},
	ul: {
		top: 15,
	},
	li: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 15,
	},
	view: {
		height: 100 * vh,
		flex: 1,
	},
	content: {
		flex: 95,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000',
		gap: 40,
	},
	container: {
		width: 80 * vw,
	},
	input: {
		backgroundColor: '#f6f6f6',
		height: 40,
		borderRadius: 5,
		fontSize: 18,
		paddingHorizontal: 8,
	},
	separator: {
		flex: 0.15,
	},
	text: {
		fontSize: 14,
		color: '#f6f6f6',
		marginBottom: 5,
	},
	registerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 25,
		gap: 5,
	},
	registerText: {
		color: '#f6f6f6',
	},
});
