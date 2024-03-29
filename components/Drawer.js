import { createDrawerNavigator } from '@react-navigation/drawer';

import { withLayoutContext } from 'expo-router';

const { Navigator } = createDrawerNavigator();

// This can be used like `<Drawer />`
export const Drawer = withLayoutContext(Navigator);
