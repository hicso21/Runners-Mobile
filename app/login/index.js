import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	Button,
	TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import StatusBar from '../../components/StatusBar';
import { vh, vw } from '../../styles/dimensions/dimensions';
import setData from '../../utils/AsyncStorage/setData';
import login from '../../utils/functions/api/post/login';
import { AntDesign } from '@expo/vector-icons';
import CountryFlag from 'react-native-country-flag';

const languages = ['es', 'us', 'de', 'it'];

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [language, setLanguage] = useState('us');
	const [languageModal, setLanguageModal] = useState(false);
	const router = useRouter();

	const handleChangeLanguage = (lang) => {
		setLanguage(lang);
		setLanguageModal(false);
		setData('language', language);
	};

	const handleLogin = async () => {
		// await login(email, password)
		if (!email || !password)
			return Toast.show({
				type: 'info',
				text1: 'Recuerda!',
				text2: 'Debes ingresar tus datos para poder iniciar sesión',
			});
		await login(email, password)
			.then((response) => {
				if (
					response.data ==
					'There is no runner with that email address.'
				)
					return Toast.show({
						type: 'error',
						text1: 'Error',
						text2: 'No se encontró ningún usuario con ese correo electrónico.',
					});
				Toast.show({
					type: 'success',
					text1: 'Genial!',
					text2: 'Tu inicio de sesión fue correcto.',
				});
				setData('user', response.data);
				setTimeout(() => {
					router.push('/home');
				}, 1000);
			})
			.catch((err) => {
				Toast.show({
					type: 'error',
					text1: 'Error',
					text2: 'Contraseña incorrecta.',
				});
			});
	};

	const handleRegister = async () => {
		router.push('/register');
	};

	return (
		<View style={styles.view}>
			<StatusBar />
			<View style={styles.content}>
				{/* <View style={styles.languageContainer}>
					<View
						style={styles.languageContent}
						onTouchEnd={() => setLanguageModal(!languageModal)}
					>
						<AntDesign name='down' size={12} color='#f6f6f6' />
						<CountryFlag
							style={styles.flag}
							isoCode={language}
							size={25}
						/>
					</View>
					{languageModal && (
						<View style={styles.ul}>
							{languages
								.filter((item) => item != language)
								.map((item) => (
									<View
										style={styles.li}
										key={item}
										onTouchEnd={() =>
											handleChangeLanguage(item)
										}
									>
										<AntDesign
											name='right'
											size={12}
											color='#f6f6f6'
										/>
										<CountryFlag
											style={styles.flag}
											isoCode={item}
											size={25}
										/>
									</View>
								))}
						</View>
					)}
				</View> */}
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
					<View style={styles.separator} />
					<View style={styles.container}>
						<Text style={styles.text}>Contraseña</Text>
						<TextInput
							placeholder='Contraseña'
							textContentType='password'
							secureTextEntry={true}
							value={password}
							onChangeText={setPassword}
							style={styles.input}
						/>
					</View>
				</View>
				<View style={{ alignItems: 'center' }}>
					<TouchableOpacity onPress={handleLogin}>
						<Text style={{ color: '#f6f6f6' }}>INICIAR SESIÓN</Text>
					</TouchableOpacity>
					<View style={styles.registerContainer}>
						<Text style={styles.registerText}>Eres nuevo?</Text>
						<TouchableOpacity onPress={handleRegister}>
							<Text style={{ color: '#f6f6f6' }}>
								REGISTRARSE
							</Text>
						</TouchableOpacity>
					</View>
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
