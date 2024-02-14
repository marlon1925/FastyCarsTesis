import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { GOOGLE_MAPS_API_KEY, MAPBOX_API_KEY } from '../../envairoments';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { UsuarioContext } from '../context/AllContexts';
import axios from 'axios';
import { theme } from '../styles/theme';
import { FloatReference } from '../components/FloatingForm';
import Icon from 'react-native-vector-icons/AntDesign';
import Geolocation from "react-native-geolocation-service";
import { ButtonStyledImg } from '../components/ButtonStyledImg';
import { FAB } from '@rneui/base';


export const MapScreen = ({ navigation }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState();
    const mapRef = useRef(null);
    const { registerForm, updateRegisterForm, originCity, handleIsLoading, handleDintance, updateRegisterOne, selectService, updateRegisterOneEnco, updateRegisterEnco, registerEncomienda, updateRegisterPriv, updateRegisterOnePriv, registerPriv, distancia, updateBoleto } = useContext(UsuarioContext)
    const [showModal, setShowModal] = useState(false);
    // let latitude
    // if(originCity){
    //     latitude = registerEncomienda.ciudadRemitente.latitude || registerPriv.ciudadSalida.latitude || registerForm.ciudadSalida.latitude
    // }
    const [region, setRegion] = useState({
        latitude: -0.9950007, // Coordenadas de Quito
        longitude: -77.8173673,
        latitudeDelta: 0.000,
        longitudeDelta: 0.0111,
    });
    useEffect(() => {
        getCurrentLocation();
    }, []);
    const handleModalClose = () => {
        setShowModal(false);
    };
    const capturarCoordenadas = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    resolve(position.coords);
                },
                (error) => {
                    reject(error);
                },
                { enableHighAccuracy: true, timeout: 60000 }
            );
        });
    };
    const getCurrentLocation = async () => {
        try {
            handleIsLoading(true);
            console.log("Entrando a la obtención de ubicación...");

            const location = await capturarCoordenadas();

            console.log("Ubicación obtenida:", location);
            console.log("Latitude:", location.latitude);
            console.log("Longitude:", location.longitude);

            setCurrentLocation({ latitude: location.latitude, longitude: location.longitude });
            selectService === "priv" ? setRegion(prevRegion => ({ ...prevRegion, latitude: location.latitude, longitude: location.longitude })) : null;

            if (originCity) {
                if (selectService === "encomienda") {
                    await getCoordinatesFromCity(originCity ? registerEncomienda.ciudadRemitente.ciudad : registerEncomienda.ciudadDestinatario.ciudad);
                } else if (selectService === "priv") {
                    // Código para el servicio privado si es necesario
                } else {
                    console.log("SALIDA", registerForm.ciudadSalida.ciudad);
                    console.log("ciudadLlegada", registerForm.ciudadLlegada.ciudad);
                    await getCoordinatesFromCity(originCity ? registerForm.ciudadSalida.ciudad : registerForm.ciudadLlegada.ciudad);
                }
            } else {
                if (selectService === "encomienda") {
                    await getCoordinatesFromCity(registerEncomienda.ciudadDestinatario.ciudad);
                } else if (selectService === "priv") {
                    // Código para el servicio privado si es necesario
                } else {
                    getCoordinatesFromCity(registerForm.ciudadLlegada.ciudad);
                }
            }
        } catch (error) {
            console.error('Error obteniendo permisos de ubicación:', error);
        } finally {
            handleIsLoading(false);
        }
    };

    const calcularDistancia = async () => {
        console.log("========== CALCULAR DISTANCIA ============")
        let encomienda = selectService == "encomienda";
        let privado = selectService == "priv" || updateBoleto?.tipoBoleto == "Privado";
        let puntoSalida
        puntoSalida = {
            latitude: encomienda ? registerEncomienda.ciudadRemitente.latitud : privado ? registerPriv.ciudadSalida.latitud : registerForm.ciudadSalida.latitud,
            longitude: encomienda ? registerEncomienda.ciudadRemitente.longitud : privado ? registerPriv.ciudadSalida.longitud : registerForm.ciudadSalida.longitud,
        };

        let puntoLlegada;
        console.log("EL ORIGEN DE LA CIUDAD: ", originCity)
        if (originCity) {
            puntoSalida = {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
            };
            puntoLlegada = {
                latitude: encomienda ? registerEncomienda.ciudadDestinatario.latitud : privado ? registerPriv.ciudadLlegada.latitud : registerForm.ciudadLlegada.latitud,
                longitude: encomienda ? registerEncomienda.ciudadDestinatario.longitud : privado ? registerPriv.ciudadLlegada.longitud : registerForm.ciudadLlegada.longitud,
            }
        } else {
            puntoLlegada = {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
            };
        }
        console.log("======== LATITUDES ========")
        console.log("LLEGADA: ", puntoLlegada)
        console.log("SALIDA: ", puntoSalida)
        try {
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${puntoSalida.longitude},${puntoSalida.latitude};${puntoLlegada.longitude},${puntoLlegada.latitude}?access_token=${process.env.MAPBOX_API_KEY}`
            );
            const distanciaEnKilometros = response.data.routes[0].distance / 1000;
            handleDintance(distanciaEnKilometros.toFixed(2))
            encomienda ? updateRegisterOneEnco("distancia", distanciaEnKilometros.toFixed(2)) : updateRegisterOne("distancia", distanciaEnKilometros.toFixed(2))
            console.log(distanciaEnKilometros.toFixed(2));
            if (privado && !originCity || registerPriv.ciudadLlegada.direccion) {
                console.log("========== LONGITUDES Y LATITUDES =========")
                console.log("CIUDAD LLEGADA: ", registerPriv.ciudadLlegada)
                console.log("CIUDAD SALIDA: ", registerPriv.ciudadSalida)
                console.log("Distancia:", distanciaEnKilometros.toFixed(2))
                console.log("PASAJEROS", registerPriv.numPax)
                let distanciaFix = (distanciaEnKilometros.toFixed(2));
                let precio;
                if (registerPriv.numPax > 4 && registerPriv.numPax < 9) {
                    precio = (0.50 * 2).toFixed(2)
                } else if (registerPriv.numPax > 8 && registerPriv.numPax < 13) {
                    precio = (0.50 * 3).toFixed(2)
                } else if (registerPriv.numPax > 12 && registerPriv.numPax < 17) {
                    precio = (0.50 * 4).toFixed(2)
                } else if (registerPriv.numPax > 16 && registerPriv.numPax < 21) {
                    precio = (0.50 * 5).toFixed(2)
                } else {
                    precio = 0.50
                }
                console.log("================= Privado ==================")
                console.log("Distancia: ", distanciaFix)
                console.log("Precio: ", precio)
                let resulPrecio = (precio * distanciaFix).toFixed(2)
                console.log("RESULTADO: ", resulPrecio)
                console.log("============================================")
                await updateRegisterOnePriv("precio", resulPrecio)
                await updateRegisterOnePriv("distancia", distanciaFix)
            } else if (selectService == "privadoT-Q" && !originCity || registerForm.ciudadLlegada.direccion) {
                console.log("========== LONGITUDES Y LATITUDES =========")
                console.log("CIUDAD LLEGADA: ", registerForm.ciudadLlegada)
                console.log("CIUDAD SALIDA: ", registerForm.ciudadSalida)
                console.log("Distancia:", distanciaEnKilometros.toFixed(2))
                console.log("PASAJEROS", registerForm.numPax)
                let distanciaFix = (distanciaEnKilometros.toFixed(2));
                let precio;
                if (registerForm.numPax > 4 && registerForm.numPax < 9) {
                    precio = (0.50 * 2).toFixed(2)
                } else if (registerForm.numPax > 8 && registerForm.numPax < 13) {
                    precio = (0.50 * 3).toFixed(2)
                } else if (registerForm.numPax > 12 && registerForm.numPax < 17) {
                    precio = (0.50 * 4).toFixed(2)
                } else if (registerForm.numPax > 16 && registerForm.numPax < 21) {
                    precio = (0.50 * 5).toFixed(2)
                } else {
                    precio = 0.50
                }
                console.log("================= Privado ==================")
                console.log("Distancia: ", distanciaFix)
                console.log("Precio: ", precio)
                let resulPrecio = (precio * distanciaFix).toFixed(2)
                console.log("RESULTADO: ", resulPrecio)
                console.log("============================================")
                await updateRegisterOne("precio", resulPrecio)
                await updateRegisterOne("distancia", distanciaFix)

            }

        } catch (error) {
            console.error('Error al calcular la distancia:', error);
        }
    };
    const getCoordinatesFromCity = async (cityName) => {
        try {
            const bbox = '-80.9673,-4.4299,-75.2337,1.3808'; // Bounding box para Ecuador

            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cityName)}.json?bbox=${bbox}&access_token=${process.env.MAPBOX_API_KEY}`);
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const firstFeature = data.features[0];
                const [longitude, latitude] = firstFeature.center;
                setRegion(prevRegion => ({ ...prevRegion, latitude, longitude }));

                console.log(`Latitud y longitud de ${cityName}: ${latitude}, ${longitude}`);
                if (originCity) {
                    if (selectService == "encomienda") {
                        const initLatitu = registerEncomienda.ciudadRemitente.latitud ? registerEncomienda.ciudadRemitent.latitude : latitude;
                        const initLogitud = registerEncomienda.ciudadRemitente.longitud ? registerEncomienda.ciudadRemitent.longitude : longitude;
                        setRegion(prevRegion => ({ ...prevRegion, initLatitu, initLogitud }));
                    } else if (selectService == "priv" || updateBoleto?.tipoBoleto == "Privado") {
                        const initLatitu = registerPriv.ciudadSalida.latitud ? registerPriv.ciudadSalida.latitud : latitude;
                        const initLogitud = registerPriv.ciudadSalida.longitud ? registerPriv.ciudadSalida.longitud : longitude;
                        setRegion(prevRegion => ({ ...prevRegion, initLatitu, initLogitud }));
                    } else {
                        const initLatitu = registerForm.ciudadSalida.latitud ? registerForm.ciudadSalida.latitud : latitude;
                        const initLogitud = registerForm.ciudadSalida.longitud ? registerForm.ciudadSalida.longitud : longitude;
                        setRegion(prevRegion => ({ ...prevRegion, initLatitu, initLogitud }));
                    }
                } else {
                    if (selectService == "encomienda") {
                        const endLatitud = registerEncomienda.ciudadDestinatario.latitud ? registerEncomienda.ciudadDestinatario.latitud : latitude;
                        const endLongitud = registerEncomienda.ciudadDestinatario.longitud ? registerEncomienda.ciudadDestinatario.longitud : longitude;
                        setRegion(prevRegion => ({ ...prevRegion, endLatitud, endLongitud }));
                    } else if (selectService == "priv" || updateBoleto?.tipoBoleto == "Privado") {
                        const endLatitud = registerPriv.ciudadLlegada.latitud ? registerPriv.ciudadLlegada.latitud : latitude;
                        const endLongitud = registerPriv.ciudadLlegada.longitud ? registerPriv.ciudadLlegada.longitud : longitude;
                        setRegion(prevRegion => ({ ...prevRegion, endLatitud, endLongitud }));
                    } else {
                        const endLatitud = registerForm.ciudadLlegada.latitud ? registerForm.ciudadLlegada.latitud : latitude;
                        const endLongitud = registerForm.ciudadLlegada.longitud ? registerForm.ciudadLlegada.longitud : longitude;
                        setRegion(prevRegion => ({ ...prevRegion, endLatitud, endLongitud }));
                    }

                }

            } else {
                console.log(`No se encontraron coordenadas para ${cityName} en Ecuador`);
            }
        } catch (error) {
            console.error('Error obteniendo coordenadas:', error);
        }
    };


    const getAddressFromCoords = async () => {

        try {
            handleIsLoading(true)
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.latitude}&lon=${userLocation.longitude}`);
            const data = await response.json();
            if (data.display_name) {
                const fullAddress = data.display_name;

                if (selectService == "encomienda") {
                    if (originCity) {
                        if (fullAddress.includes(registerEncomienda.ciudadRemitente.ciudad)) {
                            console.log("DIRENCCION CIUDAD LLEGADA: ", registerEncomienda.ciudadDestinatario.direccion)
                            registerEncomienda.ciudadDestinatario.direccion ? calcularDistancia() : null
                            setShowModal(true)
                            updateRegisterEnco("ciudadRemitente", "direccion", fullAddress);
                        } else {
                            Alert.alert("UBICACIÓN", `La ubicación debe estar dentro de ${registerEncomienda.ciudadRemitente.ciudad}`);
                        }
                    } else if (fullAddress.includes(registerEncomienda.ciudadDestinatario.ciudad)) {
                        updateRegisterEnco("ciudadDestinatario", "direccion", fullAddress);
                        setShowModal(true)
                    } else {
                        Alert.alert("UBICACIÓN", `La ubicación debe estar dentro de ${registerEncomienda.ciudadDestinatario.ciudad}`);
                    }
                } else if (selectService == "priv" || updateBoleto?.tipoBoleto == "Privado") {
                    if (originCity) {
                        if (fullAddress.includes("Ecuador")) {
                            console.log("DIRENCCION CIUDAD LLEGADA: ", registerPriv.ciudadLlegada.direccion)
                            registerPriv.ciudadLlegada.direccion ? calcularDistancia() : null
                            setShowModal(true)
                            updateRegisterPriv("ciudadSalida", "direccion", fullAddress);
                            updateRegisterPriv("ciudadSalida", "ciudad", data.address.county);
                        } else {
                            Alert.alert("UBICACIÓN", `La ubicación debe estar dentro del Ecuador`);
                        }
                    } else if (fullAddress.includes("Ecuador")) {
                        updateRegisterPriv("ciudadLlegada", "direccion", fullAddress);
                        updateRegisterPriv("ciudadLlegada", "ciudad", data.address.county);
                        setShowModal(true)
                    } else {
                        Alert.alert("UBICACIÓN", `La ubicación debe estar dentro de Ecuador`);
                    }
                } else {
                    if (originCity) {
                        if (fullAddress.includes(registerForm.ciudadSalida.ciudad)) {
                            console.log("DIRENCCION CIUDAD LLEGADA: ", registerForm.ciudadLlegada.direccion)
                            registerForm.ciudadLlegada.direccion ? calcularDistancia() : null
                            setShowModal(true)
                            updateRegisterForm("ciudadSalida", "direccion", fullAddress);

                        } else {
                            Alert.alert("UBICACIÓN", `La ubicación debe estar dentro de ${registerForm.ciudadSalida.ciudad}`);
                        }
                    } else if (fullAddress.includes(registerForm.ciudadLlegada.ciudad)) {
                        updateRegisterForm("ciudadLlegada", "direccion", fullAddress);
                        setShowModal(true)
                    } else {
                        Alert.alert("UBICACIÓN", `La ubicación debe estar dentro de ${registerForm.ciudadLlegada.ciudad}`);
                    }
                }

            } else {
                console.log('No se pudo obtener la dirección.');
            }
        } catch (error) {
            console.error('Error obteniendo la dirección:', error);
        } finally {
            handleIsLoading(false)
        }
    };


    const handleConfirmLocation = async () => {
        try {
            handleIsLoading(true)
            if (originCity) {
                if (selectService == "encomienda") {
                    updateRegisterEnco("ciudadRemitente", "latitud", userLocation.latitude)
                    updateRegisterEnco("ciudadRemitente", "longitud", userLocation.longitude)
                } else if (selectService == "priv" || updateBoleto?.tipoBoleto == "Privado") {
                    updateRegisterPriv("ciudadSalida", "latitud", userLocation.latitude)
                    updateRegisterPriv("ciudadSalida", "longitud", userLocation.longitude)
                } else {
                    updateRegisterForm("ciudadSalida", "latitud", userLocation.latitude)
                    updateRegisterForm("ciudadSalida", "longitud", userLocation.longitude)
                }
                const locationLinkSalida = `https://www.google.com/maps/search/?api=1&query=${userLocation.latitude},${userLocation.longitude}`;
                console.log("Locacion Salida", locationLinkSalida)
            } else {
                if (selectService == "encomienda") {
                    updateRegisterEnco("ciudadDestinatario", "latitud", userLocation.latitude)
                    updateRegisterEnco("ciudadDestinatario", "longitud", userLocation.longitude)
                } else if (selectService == "priv" || updateBoleto?.tipoBoleto == "Privado") {
                    updateRegisterPriv("ciudadLlegada", "latitud", userLocation.latitude)
                    updateRegisterPriv("ciudadLlegada", "longitud", userLocation.longitude)
                } else {
                    updateRegisterForm("ciudadLlegada", "latitud", userLocation.latitude)
                    updateRegisterForm("ciudadLlegada", "longitud", userLocation.longitude)
                }
                await calcularDistancia();
                const locationLinkLlegada = `https://www.google.com/maps/search/?api=1&query=${userLocation.latitude},${userLocation.longitude}`;
                console.log("Locacion Llegada", locationLinkLlegada)
            }
            console.log("Registro pasajero", registerForm)
            if (selectService == "encomienda") {
                updateRegisterOneEnco("precio", registerEncomienda.numPaquetes * 10)
                updateBoleto ? null : updateRegisterOneEnco("estadoPaquete", "Pendiente")
                updateRegisterOneEnco("tipoBoleto", "Encomienda")
                navigation.goBack()

            } else if (selectService == "priv" || updateBoleto?.tipoBoleto == "Privado") {
                console.log("Distancia", distancia)
                updateBoleto ? null : updateRegisterOnePriv("estadoPax", "Pendiente")
                updateRegisterOnePriv("tipoBoleto", "Privado")

                navigation.goBack()

            } else if (selectService == "privadoT-Q") {
                updateBoleto ? null : updateRegisterOne("estadoPax", "Pendiente")
                updateRegisterOne("tipoBoleto", "Privado")
                navigation.goBack()
            } else {
                updateRegisterOne("precio", registerForm.numPax * 20)
                updateBoleto ? null : updateRegisterOne("estadoPax", "Pendiente")
                updateRegisterOne("tipoBoleto", "Compartido")
                navigation.goBack()
            }
        } catch (error) {
            console.log("Error al guardar estado:", error)
        } finally {
            handleIsLoading(false)
        }

    };
    const moveTo = async (position) => {
        const camera = await mapRef.current?.getCamera();
        if (camera) {
            camera.center = position;
            mapRef.current.animateCamera(camera, { duration: 1000 });
        }
    };
    const handleNavigateToCurrentLocation = () => {
        console.log("CURRENTLOCATION", currentLocation)
        setUserLocation(currentLocation)
        moveTo(currentLocation)
    }

    const handleMapRegionChange = newRegion => {
        // Actualizar la posición del marcador cuando cambia la región del mapa
        setUserLocation({
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
        });
    };

    const GooglePlacesInput = () => {
        return (
            <View style={{ marginTop: 15 }}>
                <InputAutoComplete
                    placeholder={"Buscar"}
                    onPlaceSelected={onPlaceSelected}
                />
            </View>
        );
    };
    const InputAutoComplete = ({ label, placeholder, onPlaceSelected }) => {
        return (
            <>
                <Text>{label}</Text>
                <GooglePlacesAutocomplete
                    placeholder={placeholder || ""}
                    fetchDetails
                    styles={{ textInput: styles.input }}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        onPlaceSelected(details);
                        console.log("UBICACION: ", details);
                    }}
                    query={{
                        key: process.env.GOOGLE_MAPS_API_KEY,
                        language: 'es',
                        components: 'country:ec'
                    }}
                />
            </>
        );
    };
    const onPlaceSelected = (details) => {
        console.log("DETALLES DEL LUGAR: ", details.name);

        const position = {
            latitude: details?.geometry.location.lat,
            longitude: details?.geometry.location.lng,
        };
        moveTo(position);
    };

    const GetModalContentPer = () => {
        return (
            <TouchableOpacity onPress={handleModalClose}>
                <Icon name="closecircleo" size={30} color="white" />
            </TouchableOpacity>
        )
    };
    const GetModalContentOk = () => {
        return (
            <ButtonStyledImg
                onPress={() => {
                    saveDirection()
                }}
                text={"Ok"}
                color={theme.colors.Blue}
                width={"100%"}
            />
        )
    };
    const saveDirection = async () => {
        await handleConfirmLocation();
        handleModalClose()
    }
    const GetModalContentOmitir = () => {
        return (
            <ButtonStyledImg
                onPress={() => {
                    saveDirection()
                }}
                text={"Omitir"}
                color={theme.colors.Blue}
                width={"100%"}
            />
        )
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                region={region}
                onRegionChange={handleMapRegionChange}
            >
                {userLocation && <Marker
                    coordinate={userLocation}
                >
                    {/* <Image
                        source={(Images.Market)}
                        style={{ width: 30, height: 30 }} // Ajusta el tamaño según tus preferencias
                    /> */}
                </Marker>}
            </MapView>

            <View style={styles.searchBox}>

                <GooglePlacesInput />

            </View>
            <View style={{ backgroundColor: "red" }}>
                <TouchableOpacity style={styles.confirmButton} onPress={() => { getAddressFromCoords() }}>
                    <Text style={styles.confirmButtonText}>Confirmar Ubicación</Text>
                </TouchableOpacity>
                <View style={styles.gpsIcon} >
                    <FAB
                        size="small"
                        icon={{
                            name: "place",
                            color: "white",
                        }}
                        onPress={handleNavigateToCurrentLocation}
                    />
                </View>
            </View>
            <FloatReference isVisible={showModal} pregunta={"Ingresa una referencia"} modalContent={<GetModalContentPer />} modalConten2={<GetModalContentOk />} modelConten3={<GetModalContentOmitir />} />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    confirmButton: {
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        backgroundColor: '#3498db',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    gpsIcon: {
        position: "absolute",
        bottom: 80,
        right: 16,
        alignItems: "flex-end"
    },
    searchBox: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        backgroundColor: 'transparent',
        borderRadius: 8,
    },
    input: {
        borderColor: "#888",
        borderWidth: 1,
        borderRadius: 12,
    }
});
