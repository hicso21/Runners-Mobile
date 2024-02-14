import { useStripe } from '@stripe/stripe-react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import getData from '../../../utils/AsyncStorage/getData';
import getPrices from '../../../utils/functions/api/get/getPrices';
import paymentSheet from '../../../utils/functions/api/post/paymentSheet';

export default function Payment() {
	const [loading, setLoading] = useState(false);
	const [priceData, setPriceData] = useState({});
	const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const { price_id } = useGlobalSearchParams();
	const router = useRouter();

	const fetch = async () => {
		const prices = await getPrices();
		const price_data = prices.find((item) => item.id === price_id);
		setPriceData(price_data);

		const user = await getData('user');
		const response = await paymentSheet(
			price_data?.unit_amount,
			price_data?.currency,
			user?.email,
			user?.name
		);

		if (!response?.paymentIntent)
			return Toast.show({
				type: 'error',
				text1: 'Ocurrió un error en el error.',
				text2: 'Por favor pulsa el botón refrescar',
			});

		initializePaymentSheet(response?.customer, response?.paymentIntent);
	};

	const initializePaymentSheet = async (customer, paymentIntent) => {
		const { error } = await initPaymentSheet({
			merchantDisplayName: 'DELAF',
			customerId: customer,
			// customerEphemeralKeySecret: ephemeralKey,
			paymentIntentClientSecret: paymentIntent,
			allowsDelayedPaymentMethods: true,
		});

		if (error) {
			Alert.alert(`Error code: ${error.code}`, error.message);
		} else {
			setLoading(true);
		}
	};

	const openPaymentSheet = async () => {
		const { error: presentError } = await presentPaymentSheet();

		if (presentError)
			return Alert.alert(
				`Error code: ${presentError.code}`,
				presentError.message
			);

		router.replace('/home');
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
		<View style={styles.view}>
			<Text style={styles.textContainer}>
				El valor es de {priceData.unit_amount / 100}{' '}
				{priceData.currency}
			</Text>
			<TouchableOpacity style={styles.btn} onPress={openPaymentSheet}>
				<Text style={styles.text}>SUSCRIBIRME</Text>
			</TouchableOpacity>
		</View>
	);
}

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
