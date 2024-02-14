import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import getTips from '../../../utils/functions/api/get/getTips';
import { vh, vw } from '../../../styles/dimensions/dimensions';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';

const RenderItem = ({ item }) => {
	return (
		<View
			style={{
				flex: 1,
				borderWidth: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#000',
				gap: 20,
				padding: 20,
			}}
		>
			<View
				style={{
					backgroundColor: '#f6f6f6',
					padding: 20,
					borderRadius: 10,
				}}
			>
				<Text style={styles.itemDescription}>{item?.description}</Text>
			</View>
		</View>
	);
};

export default function () {
	const [tips, setTips] = useState([
		{
			description:
				'La cadencia o cantidad de pasos por minuto es sumamente importante que este en un promedio de 180 para asi disminuir el impacto, caer debajo nuestro y mejorar nuestra eficiencia.',
		},
		{
			description:
				'SEGUIR UNA ADECUADA LINEA DE CARGAS DE ENTRENAMIENTO ES VITAL PARA CREAR CORRECTOS ESTIMULOS Y CAER EN UNA SOBRECARGA.',
		},
		{
			description:
				'ADAPTAR SIEMPRE NUESTRO ESFUERZO AL ENTORNO, YA QUE LA TEMPERATURA, LA ALTITUD, LA HUMEDAD, LA SUPERFICIE O EL VIENTO PUEDEN AFECTARNOS SI NO LOS TENEMOS EN CUENTA.',
		},
		{
			description:
				'CONTROLAR LA INGESTA DE AGUA, MINERALES E HIDRATOS ES IMPORTANTE PARA PODER MANTENER UN RENDIMIENTO CONSTANTE A TRAVES DEL TIEMPO.',
		},
	]);

	const fetch = async () => {
		const { data, error } = await getTips();
		if (error)
			return Toast.show({
				type: 'error',
				text1: 'Ocurrió un error, por favor contáctanos.',
			});
		if (data.length) setTips(data);
		else Toast.show({ type: 'info', text1: 'Aún no hay videos' });
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#000',
			}}
		>
			<Carousel
				loop
				width={100 * vw}
				height={`calc(${100 * vh} - ${6.2 * vh})`}
				data={tips}
				onSnapToItem={(index) => console.log('current index:', index)}
				renderItem={RenderItem}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	itemText: {
		textAlign: 'left',
		fontSize: 22,
		color: '#f6f6f6',
		paddingLeft: 5,
		borderTopWidth: 1,
		borderTopColor: '#f6f6f6',
		paddingTop: 5,
		textTransform: 'lowercase',
	},
	itemDescription: {
		textAlign: 'left',
		fontSize: 28,
		color: '#000',
	},
});
