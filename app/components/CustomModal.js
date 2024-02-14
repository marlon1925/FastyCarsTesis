import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign';
import { theme } from '../styles/theme';
import { UsuarioContext } from '../context/AllContexts';
import { ActivityIndicator } from 'react-native-paper';
import { Overlay } from '@rneui/base';
import GifLoad from '../../assets/loading.gif'
import { Image } from 'react-native-animatable';

export const CustomModal = ({ isVisible, closeModal, pregunta, modalContent, potition }) => {

  return (
    <Modal isVisible={isVisible} animationIn="slideInUp" animationOut="slideOutDown">

      <View style={{ flex: 1, justifyContent: potition ? potition : "center" }}>
        <View style={{ backgroundColor: theme.colors.BackGroundBlue, padding: 16, flexDirection: "row", borderTopEndRadius: 15, borderTopStartRadius: 15 }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ color: "white", textAlign: "center", fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText }}>{pregunta}</Text>
          </View>
          <View>
            <TouchableOpacity onPress={closeModal} >
              <Icon name="closecircleo" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ backgroundColor: 'white', padding: 16, borderBottomEndRadius: 15, borderBottomStartRadius: 15 }}>
          {modalContent}
        </View>
      </View>
    </Modal>
  );
};

export const LoadingModal = () => {
  const { isLoading } = useContext(UsuarioContext);

  return (
    <Overlay
      isVisible={isLoading}
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}
      windowBackgroundColor={"rgba(255,255,255,0.3)"}
    >
      <View style={styles.activityIndicatorWrapper}>
        <Image
          source={GifLoad} // Reemplaza 'URL_DEL_GIF' con la URL o ruta local de tu GIF
          style={{ width: 50, height: 50, alignItems: "center", justifyContent: "center" }}
        />
        {/* <ActivityIndicator animating={isLoading} size="large" color={theme.colors.BackGroundBlue} /> */}
        <Text style={{ textAlign: "center", marginTop: 20 }}>Cargando</Text>
      </View>

    </Overlay>

  );
};


const styles = StyleSheet.create({
  overlay: {
    height: 150,
    width: "65%",
    backgroundColor: "white",
    borderRadius: 15,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
});
