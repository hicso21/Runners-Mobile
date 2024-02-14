import { StyleSheet, Dimensions } from 'react-native';

const vw = Dimensions.get('screen').width / 100;
const vh = Dimensions.get('screen').height / 100;

const styles = StyleSheet.create({
	view: {
		height: 100*vh - 4.9*vh,
	},
});

export default styles;
