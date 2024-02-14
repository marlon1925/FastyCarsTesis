import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { UsuarioContext } from "../AllContexts";
import {
  HANDLEBOLETOUPDATE,
  HANDLECITY,
  HANDLECURRENTLOCATION,
  HANDLEDISTANCE,
  HANDLEISCONNECTIONACTIVATE, HANDLEISINTERNET, HANDLEISLOADING, HANDLEISSPLASH, HANDLEORIGENCITY, HANDLERESERVATIONLOG, HANDLERUTAS, HANDLESELECTRUTAS, HANDLESERVICE, HANDLETYPEACCOUNT, HANDLEUSERINFO, RESETREGISTERENCOM, RESETREGISTERFORM, RESETREGISTERPRIV, UPDATEREGISTERENCOM, UPDATEREGISTERFORM, UPDATEREGISTERONE, UPDATEREGISTERONEENCOM, UPDATEREGISTERONEPRIV, UPDATEREGISTERPRIV,
} from "./UsuarioTypes";
import { UsuarioReducer } from "./UsuarioReducer";
import { baseURL } from "../../utils/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken, removeToken, saveToken } from "../../common/keyGeneric";
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";


export const UsuarioState = ({ children }) => {
  const [auth, setAuth] = useState({})
  const initialValue = useMemo(
    () => ({
      isConnectionActivate: false,
      registerForm: {
        tipoBoleto: "",
        user: {
          nombre: '',
          apellido: '',
          phone: '',
        },
        ciudadSalida: {
          ciudad: '',
          latitud: '',
          longitud: '',
          referencia: '',
          direccion: '',
        },
        ciudadLlegada: {
          ciudad: '',
          latitud: '',
          longitud: '',
          referencia: '',
          direccion: '',
        },
        numPax: null,
        turno: {
          horario: '',
          fecha: '',
        },
        precio: 0,
        distancia: 0,
      },
      registerPriv: {
        user: {
          nombre: '',
          apellido: '',
          phone: '',
        },
        ciudadSalida: {
          ciudad: '',
          latitud: '',
          longitud: '',
          referencia: '',
          direccion: '',
        },
        ciudadLlegada: {
          ciudad: '',
          latitud: '',
          longitud: '',
          referencia: '',
          direccion: '',
        },
        numPax: null,
        turno: {
          horario: '',
          fecha: '',
        },
        precio: 0,
        distancia: 0,
        tipoBoleto: "",
      },
      registerEncomienda: {
        remitente: {
          nombre: '',
          apellido: '',
          phone: '',
        },
        destinatario: {
          nombre: '',
          apellido: '',
          phone: '',
        },
        ciudadRemitente: {
          ciudad: '',
          latitud: '',
          longitud: '',
          referencia: '',
          direccion: '',
        },
        ciudadDestinatario: {
          ciudad: '',
          latitud: '',
          longitud: '',
          referencia: '',
          direccion: '',
        },
        numPaquetes: "",
        turno: {
          horario: '',
          fecha: '',
        },
        precio: 0,
        distancia: 0,
      },
      userInfo: null,
      isLoading: false,
      isSplash: false,
      originCity: null,
      distancia: null,
      rutas: null,
      selectRuta: [],
      selectCity: null,
      selectService: null,
      reservationLog: null,
      updateBoleto: null,
      currentLocation: null,
      isConnexioInternet: false,
      typeAccount: false,
    }),
    []
  );

  const perfil = async (token, validate) => {
    try {
      console.log("=============PERFIL=====================")
      const idClient = await AsyncStorage.getItem('idClient');
      let service = validate ? "perfil" : `conductor/${idClient}`
      const url = `${baseURL()}${service}`;
      console.log("URL", url)
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await fetch(url, options);
      const bodyResponse = await respuesta.json();
      console.log("RESPUESTA DEL PERFIL", bodyResponse)
      if (respuesta.ok) {
        handleUserInfo(bodyResponse);
        setAuth(bodyResponse);
      } else {
        //handleLogout()
      }

    } catch (error) {
      console.log(error);
    }
  };

  const [state, dispatch] = useReducer(UsuarioReducer, initialValue);

  const handleIsConnectionActivate = useCallback((data) => {
    dispatch({ type: HANDLEISCONNECTIONACTIVATE, payload: data });
  }, []);
  const handleCurrentLocation = useCallback((data) => {
    dispatch({ type: HANDLECURRENTLOCATION, currentLocation: data });
  }, []);
  const handleBoletoUpdate = useCallback((data) => {
    dispatch({ type: HANDLEBOLETOUPDATE, payload: data });
  }, []);
  const handleReservationLog = useCallback((data) => {
    dispatch({ type: HANDLERESERVATIONLOG, payload: data });
  }, []);
  const handleService = useCallback((data) => {
    dispatch({ type: HANDLESERVICE, payload: data });
  }, []);
  const handleCity = useCallback((data) => {
    dispatch({ type: HANDLECITY, payload: data });
  }, []);
  const handleRutas = useCallback((data) => {
    dispatch({ type: HANDLERUTAS, payload: data });
  }, []);
  const handleSelecRutas = useCallback((data) => {
    dispatch({ type: HANDLESELECTRUTAS, payload: data });
  }, []);
  const handleUserInfo = useCallback((data) => {
    dispatch({ type: HANDLEUSERINFO, payload: data });
  }, []);
  const handleDintance = useCallback((data) => {
    dispatch({ type: HANDLEDISTANCE, payload: data });
  }, []);
  const handleIsLoading = useCallback((data) => {
    dispatch({ type: HANDLEISLOADING, payload: data });
  }, []);
  const handleIsSplash = useCallback((data) => {
    dispatch({ type: HANDLEISSPLASH, payload: data });
  }, []);
  const updateRegisterForm = useCallback((field1, field2, value) => {
    dispatch({ type: UPDATEREGISTERFORM, payload: { field1, field2, value } });
  }, []);
  const updateRegisterOne = useCallback((field1, value) => {
    dispatch({ type: UPDATEREGISTERONE, payload: { field1, value } });
  }, []);
  const resetReservation = useCallback(() => {
    dispatch({ type: RESETREGISTERFORM });
  })
  const updateRegisterEnco = useCallback((field1, field2, value) => {
    dispatch({ type: UPDATEREGISTERENCOM, payload: { field1, field2, value } });
  }, []);
  const updateRegisterOneEnco = useCallback((field1, value) => {
    dispatch({ type: UPDATEREGISTERONEENCOM, payload: { field1, value } });
  }, []);
  const resetReservationEnco = useCallback(() => {
    dispatch({ type: RESETREGISTERENCOM });
  })
  const updateRegisterPriv = useCallback((field1, field2, value) => {
    dispatch({ type: UPDATEREGISTERPRIV, payload: { field1, field2, value } });
  }, []);
  const updateRegisterOnePriv = useCallback((field1, value) => {
    dispatch({ type: UPDATEREGISTERONEPRIV, payload: { field1, value } });
  }, []);
  const resetReservationPriv = useCallback(() => {
    dispatch({ type: RESETREGISTERPRIV });
  })
  const handleOrigenCity = useCallback((data) => {
    dispatch({ type: HANDLEORIGENCITY, payload: data });
  }, []);
  const handleIsConnexioInternet = useCallback((data) => {
    dispatch({ type: HANDLEISINTERNET, payload: data });
  }, []);
  const handleTypeAccount = useCallback((data) => {
    dispatch({ type: HANDLETYPEACCOUNT, payload: data });
  }, []);

  const checkInternetConnection = async () => {
    try {
      handleIsSplash(true);
      const unsubscribe = NetInfo.addEventListener(async (state) => {
        if (state.isConnected) {
          // La conexión está activa
          handleIsConnexioInternet(true);
        } else {
          // La conexión está inactiva
          handleIsConnexioInternet(false);
        }
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Error al verificar la conexión a Internet:', error);
    } finally {
      handleIsSplash(false);
    }
  };

  // Llama a la función en tu componente principal o donde sea necesario
  useEffect(() => {
    checkInternetConnection();
  }, []);

  const handleLogout = async () => {
    try {
      handleIsLoading(true)
      await removeToken('Token');
      await removeToken('idClient')
      await removeToken('rolCliente')
      await removeToken('correoPass')
      handleIsConnectionActivate(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      handleIsLoading(false)
    }
  };
  const handleLogin = async () => {
    // Realizar la solicitud de inicio de sesión
    const url = `${baseURL()}login`;
    let body = {
      correo: await AsyncStorage.getItem('correo'),
      password: await AsyncStorage.getItem('password'),
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    try {
      handleIsSplash(true);
      const response = await fetch(url, options);
      const bodyResponse = await response.json();

      // Verificar el estado de la respuesta
      if (bodyResponse.result) {
        // Solicitud exitosa, puedes realizar acciones adicionales aquí si es necesarios
        // Guardar el token de acceso en AsyncStorage
        const tokenToSave = bodyResponse.token;

        if (tokenToSave) {
          const encryptedToken = await saveToken('Token', tokenToSave);
          const idClient = await saveToken('idClient', bodyResponse._id)
          const rolCliente = await saveToken('rol', bodyResponse.rol)
          await AsyncStorage.setItem('Token', encryptedToken);
          await AsyncStorage.setItem('idClient', idClient);
          await AsyncStorage.setItem('rolCliente', rolCliente);
        }
        if (response.ok) {
          await verificarSesion()
        } else {
          await handleLogout()
        }
      } else {
        Alert.alert("Ocurrió un error", "Error al cargar datos, por favor vuelva a iniciar sesión")
        handleLogout()

      }
    } catch (error) {
      // Manejar errores generales
      console.error('Error en la solicitud:', error);
    } finally {
      handleIsSplash(false);
    }
  };
  // Verificar si hay un usuario almacenado al cargar la aplicación
  const verificarSesion = async () => {
    try {
      handleIsSplash(true);
      const token = await AsyncStorage.getItem('Token');
      const rolCliente = await AsyncStorage.getItem('rolCliente');
      console.log("rolCliente", rolCliente)
      console.log("token", token)
      console.log("Verificacion token: ", token)
      console.log("Verificacion pasajero: ", rolCliente === "pasajero")
      console.log("Verificacion condutor: ", rolCliente === "conductor")

      if (token && rolCliente === "pasajero") {
        await perfil(token, true);
        handleIsConnectionActivate(true);
        handleTypeAccount(true)
      } else if (token && rolCliente === "conductor") {
        await perfil(token, false)
        handleIsConnectionActivate(true);
        handleTypeAccount(false)
      } else {
        handleIsConnectionActivate(false);
      }
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
    } finally {
      handleIsSplash(false);
    }
  };

  useEffect(() => {
    loginVerifite()
  }, [handleIsConnectionActivate]);
  const loginVerifite = async () => {
    const token = await AsyncStorage.getItem('Token');
    console.log("TOKEN", token)
    token ? handleLogin() : null
  }

  return (
    <UsuarioContext.Provider
      value={{
        ...state,
        ...{
          handleIsConnectionActivate,
          updateRegisterForm,
          handleIsLoading,
          handleUserInfo,
          updateRegisterOne,
          handleOrigenCity,
          handleDintance,
          handleRutas,
          handleSelecRutas,
          handleCity,
          resetReservation,
          handleService,
          updateRegisterEnco,
          updateRegisterOneEnco,
          resetReservationEnco,
          updateRegisterPriv,
          updateRegisterOnePriv,
          resetReservationPriv,
          handleReservationLog,
          handleBoletoUpdate,
          handleCurrentLocation,
          handleIsConnexioInternet,
          handleTypeAccount,
          handleIsSplash
        },
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};
