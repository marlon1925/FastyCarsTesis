import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import Icon from 'react-native-vector-icons/Foundation';

export const DropdownButton = () => {
    const [showOptions, setShowOptions] = useState(false);
    const [options, setOptions] = useState("Quito - Tena");

    const handleButtonClick = () => {
        setShowOptions(!showOptions);
    };

    const handleOptionClick = (option) => {
        // Lógica para manejar la selección de la opción
        console.log(`Opción seleccionada: ${option}`);
        // Puedes realizar acciones adicionales según la opción seleccionada

        // Oculta las opciones después de seleccionar una
        setShowOptions(false);
    };

    return (
        <View style={{ zIndex: 1 }}>
            <TouchableOpacity onPress={handleButtonClick}
                style={{ backgroundColor: theme.colors.BackGroundInpu, width: 120, height: 30, justifyContent: "center", alignItems: "center", borderRadius: showOptions ? 0 : 15, borderTopStartRadius: showOptions ? 15 : 15, borderTopEndRadius: showOptions ? 15 : 15, borderColor: "#0f0f0f", borderWidth: 1 }}
            >
                <Text>{options}   <Icon name="arrow-down" size={15} color="#0f0f0f" />
                </Text>
            </TouchableOpacity>
            {console.log(showOptions)
            }
            {showOptions && (
                <View style={{ backgroundColor: theme.colors.BackGroundInpu, width: 120, height: 80, justifyContent: "center", alignItems: "center", borderBottomEndRadius: 15, borderBottomStartRadius: 15, borderColor: "black", borderWidth: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => {
                            handleOptionClick('Quito - Tena')
                            setOptions('Quito - Tena')
                        }}>
                            <Text>Quito - Tena</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => {
                            handleOptionClick('Quito - Ibarra')
                            setOptions('Quito - Ibarra')
                        }}>
                            <Text>Quito - Ibarra</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

