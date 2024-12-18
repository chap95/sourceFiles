import {useNavigation} from '@react-navigation/native';

function usePrevScreen() {
  const navigation = useNavigation();
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];

  return prevRoute;
}

export default usePrevScreen;
