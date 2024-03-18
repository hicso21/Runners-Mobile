import { useStripe, CardField } from '@stripe/stripe-react-native';
import { useFocusEffect, useGlobalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
	Alert,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Button,
	TextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import getData from '../../../utils/AsyncStorage/getData';
import getPrices from '../../../utils/functions/api/get/getPrices';
import paymentSheet from '../../../utils/functions/api/post/paymentSheet';
import createPaymentIntent from '../../../utils/functions/api/post/createPaymentIntent';

export default function CardFlow() {
	const [pan, setPan] = useState('');
	const [expiryDate, setExpiryDate] = useState('');
	const [cvc, setCvc] = useState('');

	const createSession = () => {
		const sessionTypes = [CARD, CVC];
		const cardDetails = {
			pan,
			expiryDate,
			cvc,
		};

		accessCheckout
			.generateSessions(cardDetails, sessionTypes)
			.then((sessions) => {
				const cardSession = sessions.card;
				const cvcSession = sessions.cvc;
				// do something with the card and cvc sessions ...
			})
			.catch((error) => {
				// do something in case of error
			});
	};

	return (
		<View>
			<TextInput
				keyboardType='numeric'
				placeholder='Card Number'
				onChangeText={setPan}
			/>
			<TextInput
				keyboardType='numeric'
				placeholder='MM/YY'
				onChangeText={setExpiryDate}
			/>
			<TextInput
				keyboardType='numeric'
				placeholder='CVC'
				onChangeText={setCvc}
			/>
			<Button title='Pagar' onPress={createSession} />
		</View>
	);
}

// export default function Payment() {
// 	const [loading, setLoading] = useState(false);
// 	const [priceData, setPriceData] = useState({});
// 	const { initPaymentSheet, presentPaymentSheet } = useStripe();
// 	const { price_id } = useGlobalSearchParams();
// 	const router = useRouter();

// 	const fetch = async () => {
// 		const prices = await getPrices();
// 		const price_data = prices.find((item) => item.id === price_id);
// 		setPriceData(price_data);

// 		const user = await getData('user');
// 		const response = await paymentSheet(
// 			price_data?.unit_amount,
// 			price_data?.currency,
// 			user?.email,
// 			user?.name
// 		);

// 		if (!response?.paymentIntent)
// 			return Toast.show({
// 				type: 'error',
// 				text1: 'Ocurrió un error en el error.',
// 				text2: 'Por favor pulsa el botón refrescar',
// 			});

// 		initializePaymentSheet(response?.customer, response?.paymentIntent);
// 	};

// 	const initializePaymentSheet = async (customer, paymentIntent) => {
// 		const { error } = await initPaymentSheet({
// 			merchantDisplayName: 'DELAF',
// 			customerId: customer,
// 			// customerEphemeralKeySecret: ephemeralKey,
// 			paymentIntentClientSecret: paymentIntent,
// 			allowsDelayedPaymentMethods: true,
// 		});

// 		if (error) {
// 			Alert.alert(`Error code: ${error.code}`, error.message);
// 		} else {
// 			setLoading(true);
// 		}
// 	};

// 	const openPaymentSheet = async () => {
// 		const { error: presentError } = await presentPaymentSheet();

// 		if (presentError)
// 			return Alert.alert(
// 				`Error code: ${presentError.code}`,
// 				presentError.message
// 			);

// 		router.replace('/home');
// 	};

// 	useFocusEffect(
// 		useCallback(() => {
// 			fetch();
// 		}, [])
// 	);

// 	return (
// 		<View style={styles.view}>
// 			<Text style={styles.textContainer}>
// 				El valor es de {parseFloat(priceData.unit_amount).toFixed(2)}{' '}
// 				{priceData.currency}
// 			</Text>
// 			<TouchableOpacity style={styles.btn} onPress={openPaymentSheet}>
// 				<Text style={styles.text}>SUSCRIBIRME</Text>
// 			</TouchableOpacity>
// 		</View>
// 	);
// }

const styles = StyleSheet.create({
	view: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000',
	},
	textContainer: {
		marginBottom: 15,
		color: '#f6f6f6',
		fontSize: 24,
	},
	btn: {
		padding: 5,
		borderColor: '#f6f6f6',
		borderWidth: 1,
		borderRadius: 5,
	},
	text: {
		color: '#f6f6f6',
		fontSize: 24,
	},
});
