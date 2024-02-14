import * as Location from "expo-location";
import { useContext } from "react";
import { UsuarioContext } from "../context/AllContexts";
import { Text, View } from "react-native";
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

export const GotoBack = ({ navigation }) => {
    return (
        <View>
            <Text style={{ fontSize: 18, fontStyle: "italic", fontWeight: "600" }} onPress={() => navigation.goBack()}> <AntDesignIcon name='arrowleft' size={20} /> Regresar </Text>
        </View>
    )
}
export const validateCorrectEmail = (email) => {
    let response;

    var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email === "" && email === " ") {
        response = "El campo correo electrónico no puede estar vacío";
    } else if (re.test(email)) {
        return validateEmailDomains(email);
    } else {
        response = "Correo inválido";
    }
    return response;
};
const validateEmailDomains = (ValueEmail) => {
    let response;
    let EmailSplit = ValueEmail.split("@");
    EmailSplit = EmailSplit[1];
    let domainsArray = EmailSplit.split(".");
    const tempArrayDuplicate = [];
    for (let i = 0; i < domainsArray.length; i++) {
        if (domainsArray[i + 1] === domainsArray[i]) {
            tempArrayDuplicate.push(domainsArray[i]);
        }
    }
    if (tempArrayDuplicate.length === 0) {
        response = "";
    } else {
        response = "Ingrese un email correcto";
    }
    return response;
};
export const regexSoloLetras = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]+$/;

export const valitdatename = (nameValue) => {
    let response;
    if (nameValue.length < 3) {
        response = "Debe tener al menos 3 caracteres"
    } else if (!regexSoloLetras.test(nameValue)) {
        response = "Ingrese solo letras"
    } else if (/^\s|\s$/.test(nameValue)) {
        response = "La contraseña no debe comenzar ni terminar con espacios en blanco";
    } else if (/\s/.test(nameValue)) {
        response = "La contraseña no debe contener espacios en blanco";
    } else {
        response = ""
    }

    return response;

}

export const validateCorrectPassword = (password) => {
    let response;

    if (password.length < 8) {
        response = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/\d/.test(password)) {
        response = "La contraseña debe tener al menos un número";
    } else if (!/[a-z]/.test(password)) {
        response = "La contraseña debe tener al menos una letra minúscula";
    } else if (!/[A-Z]/.test(password)) {
        response = "La contraseña debe tener al menos una letra mayúscula";
    } else if (!/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/.test(password)) {
        response = "La contraseña debe tener al menos un carácter especial";
    } else if (/\s/.test(password)) {
        response = "La contraseña no debe contener espacios en blanco";
    } else {
        response = "";
    }

    return response;
};

export const validateConfirmPassword = (password, confimpasword) => {
    let response;

    if (password === confimpasword) {
        response = ""
    } else {
        response = "No coincide las contraseñas"
    }
    return response;
}
export const validateCorrectPhone = (phone) => {
    if (/^09\d{8}$/.test(phone)) {
        return '';
    }
    return 'Ingrese un número válido que comience con 09';
};


export const handleButtonPress = (buttonId, state) => {

    // Cambia el botón seleccionado según el id del botón
    state == "horario" ?
        setColorHourHand((prevButton) => (prevButton === buttonId ? null : buttonId))
        : state == "City" ?
            setColorCity((prevButton) => (prevButton === buttonId ? null : buttonId))
            : state == "personas" ?
                setPersonas((prevButton) => (prevButton === buttonId ? null : buttonId))
                :
                setColorReserve((prevButton) => (prevButton === buttonId ? null : buttonId))
};

export const baseURL = () => {
    console.log("===== LA URL DEL BACK =====", process.env.BACKEND_URL)
    return process.env.BACKEND_URL
}

export const coordenadaCiudades = () => {
    const ciudades = [
        quito = {
            latitud: -0.1906276,
            longitud: -78.4889243,
        },
        tena = {
            latitud: -0.9945212,
            longitud: 77.8214307
        }
    ]

    return ciudades
}
