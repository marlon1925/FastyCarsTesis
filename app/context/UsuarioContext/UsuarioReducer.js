import { HANDLEBOLETOUPDATE, HANDLECITY, HANDLECURRENTLOCATION, HANDLEDISTANCE, HANDLEISCONNECTIONACTIVATE, HANDLEISINTERNET, HANDLEISLOADING, HANDLEISSPLASH, HANDLEORIGENCITY, HANDLERESERVATIONLOG, HANDLERUTAS, HANDLESELECTRUTAS, HANDLESERVICE, HANDLETYPEACCOUNT, HANDLEUSERINFO, RESETREGISTERENCOM, RESETREGISTERFORM, RESETREGISTERPRIV, SETUSER, UPDATEREGISTERENCOM, UPDATEREGISTERFORM, UPDATEREGISTERONE, UPDATEREGISTERONEENCOM, UPDATEREGISTERONEPRIV, UPDATEREGISTERPRIV } from "./UsuarioTypes";

export const UsuarioReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case HANDLEISCONNECTIONACTIVATE:
      return { ...state, isConnectionActivate: payload };
    case HANDLETYPEACCOUNT:
      return { ...state, typeAccount: payload };
    case HANDLEISINTERNET:
      return { ...state, isConnexioInternet: payload };
    case HANDLEISLOADING:
      return { ...state, isLoading: payload };
    case HANDLEISSPLASH:
      return { ...state, isSplash: payload };
    case HANDLEORIGENCITY:
      return { ...state, originCity: payload };
    case HANDLEUSERINFO:
      return { ...state, userInfo: payload };
    case HANDLEDISTANCE:
      return { ...state, distancia: payload };
    case HANDLESELECTRUTAS:
      return { ...state, selectRuta: payload };
    case HANDLECITY:
      return { ...state, selectCity: payload };
    case HANDLERUTAS:
      return { ...state, rutas: payload };
    case HANDLERESERVATIONLOG:
      return { ...state, reservationLog: payload };
    case HANDLESERVICE:
      return { ...state, selectService: payload };
    case HANDLEBOLETOUPDATE:
      return { ...state, updateBoleto: payload };
    case HANDLECURRENTLOCATION:
      return { ...state, currentLocation: payload };
    case UPDATEREGISTERFORM:
      return {
        ...state,
        registerForm: {
          ...state.registerForm,
          [payload.field1]: {
            ...state.registerForm[payload.field1],
            [payload.field2]: payload.value,
          },
        },
      };
    case UPDATEREGISTERONE:
      return {
        ...state,
        registerForm: {
          ...state.registerForm,
          [payload.field1]: payload.value
        },
      };
    case RESETREGISTERFORM:
      return {
        ...state,
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
        }
      };
    case UPDATEREGISTERENCOM:
      return {
        ...state,
        registerEncomienda: {
          ...state.registerEncomienda,
          [payload.field1]: {
            ...state.registerEncomienda[payload.field1],
            [payload.field2]: payload.value,
          },
        },
      };
    case UPDATEREGISTERONEENCOM:
      return {
        ...state,
        registerEncomienda: {
          ...state.registerEncomienda,
          [payload.field1]: payload.value
        },
      };
    case RESETREGISTERENCOM:
      return {
        ...state,
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
        },
      };

    case UPDATEREGISTERPRIV:
      return {
        ...state,
        registerPriv: {
          ...state.registerPriv,
          [payload.field1]: {
            ...state.registerPriv[payload.field1],
            [payload.field2]: payload.value,
          },
        },
      };
    case UPDATEREGISTERONEPRIV:
      return {
        ...state,
        registerPriv: {
          ...state.registerPriv,
          [payload.field1]: payload.value
        },
      };
    case RESETREGISTERPRIV:
      return {
        ...state,
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
          numPax: "",
          turno: {
            horario: '',
            fecha: '',
          },
          precio: 0,
        },
      };

    case SETUSER:
      return {
        ...state,
        userInfo: payload,
      };
    default:
      break;
  }
};
