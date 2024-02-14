
import { registerRootComponent } from "expo";
import { UsuarioState } from "./app/context/UsuarioContext/UsuarioState";
import App from "./App";
import { NavigationContainer } from "@react-navigation/native";
import { LoadingModal } from "./app/components/CustomModal";
import { Splash } from "./app/screens/Splash";



registerRootComponent(InitApp)

function InitApp() {
    return (
        <UsuarioState>
            <NavigationContainer>
                <App />
                <LoadingModal />
                <Splash />
            </NavigationContainer>
        </UsuarioState>
    );
}