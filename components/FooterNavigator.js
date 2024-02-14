import { Entypo, MaterialIcons, Octicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { ICONS_SIZE, style } from '../styles/footerNavigator.js';

export default function FooterNavigator() {
	const router = useRouter();
	const path = usePathname();

	return (
		<View style={style.container}>
			<TouchableOpacity
				style={{
					...style.iconContainer,
					opacity: !path.includes('/home') ? 0.5 : 1,
				}}
				onPress={() => router.push('/home')}
			>
				<Entypo size={ICONS_SIZE} name='home' style={style.icons} />
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					...style.iconContainer,
					opacity: !path.includes('/multimedia') ? 0.5 : 1,
				}}
				onPress={() => router.push('/multimedia')}
			>
				<MaterialIcons
					name='ondemand-video'
					size={ICONS_SIZE}
					style={style.icons}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					...style.iconContainer,
					opacity: !path.includes('/stats') ? 0.5 : 1,
				}}
				onPress={() => router.push('/stats')}
			>
				<Octicons size={ICONS_SIZE} name='graph' style={style.icons} />
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					...style.iconContainer,
					opacity: !path.includes('/calendar') ? 0.5 : 1,
				}}
				onPress={() => router.push('/calendar')}
			>
				<Entypo size={ICONS_SIZE} name='calendar' style={style.icons} />
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					...style.iconContainer,
					opacity: !path.includes('/chat') ? 0.5 : 1,
				}}
				onPress={() => router.push('/chat')}
			>
				<Entypo size={ICONS_SIZE} name='chat' style={style.icons} />
			</TouchableOpacity>
		</View>
	);
}
