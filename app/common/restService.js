import { Alert } from "react-native"
import { baseURL } from "../utils/helpers";
import { getToken } from "./keyGeneric";


export const post = async (toke, initLoading, data, service, sucction, finishLoading) => {
    try {
        initLoading
        const url = `${baseURL()}${service}`;
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },

        };
        const respuesta = await fetch(url, options);
        const bodyResponse = await respuesta.json();
        sucction(bodyResponse)
    } catch (error) {
        Alert.alert("Error", error)
    } finally {
        finishLoading
    }
}

export const get = async (token, initLoading, data, service, sucction, finishLoading) => {
    try {
        initLoading
        const url = `${baseURL()}${service}`;
        const options = {
            method: 'GET',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const respuesta = await fetch(url, options);
        const bodyResponse = await respuesta.json();
        console.log("Repusta", bodyResponse)
        sucction(bodyResponse)
    } catch (error) {
        // Alert.alert("Error", error)
    } finally {
        finishLoading
    }
}

export const put = async (toke, initLoading, data, service, sucction, finishLoading) => {
    try {
        initLoading
        const url = `${baseURL()}${service}`;
        const options = {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const respuesta = await fetch(url, options);
        const bodyResponse = await respuesta.json();
        sucction(bodyResponse)
    } catch (error) {
        Alert.alert("Error", error)
    } finally {
        finishLoading
    }
}