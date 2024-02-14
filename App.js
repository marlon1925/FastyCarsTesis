import "react-native-gesture-handler";
import { AuthNavigator } from './app/navigarions/AuthNavigator';
import { useContext } from 'react';
import { UsuarioContext } from './app/context/AllContexts';
import { DrawerNavigation } from "./app/navigarions/DrawerNavigation";
import { NoConnection } from "./app/screens/NoConnection";
import { DriverNavigation } from "./app/navigarions/DriverNavigation";



export default function App() {
  const { isConnectionActivate, isConnexioInternet, typeAccount } = useContext(UsuarioContext);
  return (
    // isConnexioInternet ? (
    //   isConnectionActivate && typeAccount == false ? 
    //   <DrawerNavigation /> : 
    //   <AuthNavigator />
    // ) : <NoConnection />
    isConnexioInternet ? (
      isConnectionActivate ? (
        typeAccount ? (
          <DrawerNavigation />
        )
          : <DriverNavigation />
      )
        : <AuthNavigator />
    )
      : <NoConnection />

  );
}
