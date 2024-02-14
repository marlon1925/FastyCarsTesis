import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black
} from "@expo-google-fonts/inter";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import { useFonts } from "expo-font";

export const FontsLoader = ({ children }) => {
  let [fontsLoaded] = useFonts({
    Itim_400Regular,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black
  });

  if (!fontsLoaded) {
    // Fuentes no cargadas, mostrar componente de carga
    return null;
  } else {
    // Fuentes cargadas, renderizar el contenido
    return <>{children}</>;
  }
};
