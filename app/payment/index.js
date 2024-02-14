import { usePaymentSheet } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import fetchApi from '../../utils/constants/fetchApi';
import { initMercadoPago } from '@mercadopago/sdk-react';

initMercadoPago()

const PaymentMP = () => {
	return (
		<View
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
		>
			<Text>Payment</Text>
		</View>
	);
};

export default PaymentMP;
