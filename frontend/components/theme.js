import { Platform } from 'react-native';

const theme = {
  fonts: {
    main: Platform.select({
      ios: 'New Times Roman',
      android: 'Roboto',
      default: 'New Times Roman',
    }),
  },
};

export default theme;