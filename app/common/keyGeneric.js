import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Keychain from "react-native-keychain";

// Objeto para almacenar las keys y tokens
const keyTokenMap = {};

export const saveToken = async (identifier, token) => {
    try {
        // Almacena el token utilizando el identificador proporcionado
        await Keychain.setGenericPassword(identifier, token);
        // Guarda el identificador en el mapa
        keyTokenMap[identifier] = token;
        console.log(`Token con identificador '${identifier}' guardado con éxito`);
        return token; // Devuelve el token guardado
    } catch (error) {
        console.error(`Error al guardar el token con identificador '${identifier}':`, error);
        throw error;
    }
};


export const getToken = async (identifier) => {
    try {
        // Verifica si el token ya está en el mapa
        const cachedToken = keyTokenMap[identifier];
        if (cachedToken) {
            console.log(`Token con identificador '${identifier}' recuperado desde el mapa`);
            return cachedToken;
        }

        // Si no está en el mapa, intenta recuperarlo desde el Keychain
        const credentials = await Keychain.getGenericPassword({
            service: identifier,
        });

        if (credentials) {
            const token = credentials.password;
            // Guarda el token en el mapa para futuras recuperaciones
            keyTokenMap[identifier] = token;
            console.log(`Token con identificador '${identifier}' recuperado desde Keychain`);
            return token;
        } else {
            console.log(`Token con identificador '${identifier}' no encontrado`);
            return null;
        }
    } catch (error) {
        console.error(`Error al recuperar el token con identificador '${identifier}':`, error);
        return null;
    }
};

export const removeToken = async (identifier) => {
    try {
        // Elimina el token utilizando el identificador proporcionado
        await Keychain.resetGenericPassword({
            service: identifier,
        });
        // Elimina el identificador del mapa
        await AsyncStorage.removeItem(identifier);

        delete keyTokenMap[identifier];
        console.log(`Token con identificador '${identifier}' eliminado con éxito`);
    } catch (error) {
        console.error(`Error al eliminar el token con identificador '${identifier}':`, error);
    }
};
