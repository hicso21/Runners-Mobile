import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { BackHandler, Linking, LogBox, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { Drawer } from '../components/Drawer.js';
import FooterNavigator from '../components/FooterNavigator';
import OpenedDrawer from '../components/OpenedDrawer.js';
import { store } from '../store/index.js';
import styles from '../styles/Views/Layout.js';
import routes from '../utils/constants/routes.js';
import stripeKeys from '../utils/constants/stripeKeys.js';
import { usePreventScreenCapture } from 'expo-screen-capture';

const pathToExclude = ['/login', '/register', '/prices', '/marchView', '/redirect'];


export default function RootLayout() {
	const path = usePathname();
	const { handleURLCallback } = useStripe();
	// usePreventScreenCapture();

	const handleDeepLink = useCallback(
		async (url) => {
			if (url) {
				const stripeHandled = await handleURLCallback(url);
				if (stripeHandled) {
					// This was a Stripe URL - you can return or add extra handling here as you see fit
				} else {
					// This was NOT a Stripe URL – handle as you normally would
				}
			}
		},
		[handleURLCallback]
	);

	const getUrlAsync = async () => {
		const initialUrl = await Linking.getInitialURL();
		handleDeepLink(initialUrl);
	};

	useEffect(() => {
		getUrlAsync();

		const deepLinkListener = Linking.addEventListener('url', (event) => {
			handleDeepLink(event.url);
		});

		return () => deepLinkListener.remove();
	}, [handleDeepLink]);

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', () => true);
	}, []);

	return (
		<>
			<PaperProvider>
				<Provider store={store}>
					<StripeProvider
						publishableKey={stripeKeys.development_publishable_key}
						merchantIdentifier='merchant.com.delaf'
					>
						<View style={styles.view}>
							<StatusBar />
							<Drawer
								drawerContent={() => <OpenedDrawer />}
								screenOptions={{
									headerTintColor: '#f6f6f6',
									headerStyle: {
										backgroundColor: '#000',
									},
									headerTitle: routes[path]
										? routes[path]
										: 'TU RUTINA DEL DÍA',
									headerShown: pathToExclude.some((item) =>
										path.includes(item)
									)
										? false
										: true,
									swipeEnabled: pathToExclude.some((item) =>
										path.includes(item)
									)
										? false
										: true,
								}}
							/>
							{!pathToExclude.some((item) =>
								path.includes(item)
							) && <FooterNavigator />}
						</View>
					</StripeProvider>
				</Provider>
			</PaperProvider>
			<Toast />
		</>
	);
}
