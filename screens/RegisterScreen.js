import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import axios from 'axios';

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigation = useNavigation();
    const handleRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password,
        };

        axios.post("http://192.168.1.86:8000/register", user)
            .then((response) => {
                console.log(response);
                
                setName("");
                setEmail("");
                setPassword("");

                Alert.alert("Registro Exitoso", response.data.message);
            })
            .catch((error) => {
                if (error.response) {
                    console.log("Data:", error.response.data);
                    console.log("Status:", error.response.status);
                    console.log("Headers:", error.response.headers);
                    // Manejo específico del error de email registrado
                    if (error.response.status === 400 && error.response.data.message === "email registrado ") {
                        Alert.alert("Registration Error", "El email ya está registrado. Por favor, intenta con otro email o inicia sesión.");
                    } else {
                        // Manejo de otros errores de respuesta
                        Alert.alert("Registration Error", error.response.data.message || "Error al registrar");
                    }
                } else if (error.request) {
                    console.log("Request:", error.request);
                    Alert.alert("Registration Error", "No response from server");
                } else {
                    console.log("Error", error.message);
                    Alert.alert("Registration Error", "Error: " + error.message);
                }
                console.log("Config:", error.config);
            });


    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center", marginTop: 50 }}>
            <View>
                <Image
                    style={{ width: 150, height: 100 }}
                    source={{
                        uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
                    }}
                />
            </View>
            <KeyboardAvoidingView>
                <View style={{ alignItems: "center" }}>
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: "bold",
                            marginTop: 12,
                            color: "#041E42",
                        }}
                    >
                        Registra tu cuenta
                    </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            backgroundColor: "#D0D0D0",
                            paddingVertical: 5,
                            borderRadius: 5,
                            marginTop: 30,
                        }}
                    >
                        <FontAwesome6 name="person" size={24} color="gray"
                            style={{ marginLeft: 8 }} />

                        <TextInput
                            value={name}
                            onChangeText={(text) => setName(text)}
                            style={{
                                color: "gray",
                                marginVertical: 10,
                                width: 300,
                                fontSize: name ? 16 : 16,
                            }}
                            placeholder="Introduce tu nombre completo"
                        />
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            backgroundColor: "#D0D0D0",
                            paddingVertical: 5,
                            borderRadius: 5,
                            marginTop: 30,
                        }}
                    >
                        <MaterialIcons
                            style={{ marginLeft: 8 }}
                            name="email"
                            size={24}
                            color="gray"
                        />

                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={{
                                color: "gray",
                                marginVertical: 10,
                                width: 300,
                                fontSize: password ? 16 : 16,
                            }}
                            placeholder="Introduce tu correo electrónico"
                        />
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            backgroundColor: "#D0D0D0",
                            paddingVertical: 5,
                            borderRadius: 5,
                            marginTop: 30,
                        }}
                    >
                        <AntDesign
                            name="lock1"
                            size={24}
                            color="gray"
                            style={{ marginLeft: 8 }}
                        />

                        <TextInput
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                            style={{
                                color: "gray",
                                marginVertical: 10,
                                width: 300,
                                fontSize: email ? 16 : 16,
                            }}
                            placeholder="Ingresa tu contraseña"
                        />
                    </View>
                </View>
                <View
                    style={{
                        marginTop: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text>Mantenme conectado</Text>

                    <Text style={{ color: "#007FFF", fontWeight: "500" }}>
                        Has olvidado tu contraseña
                    </Text>
                </View>

                <View style={{ marginTop: 80 }} />

                <Pressable
                    onPress={handleRegister}
                    style={{
                        width: 200,
                        backgroundColor: "#FEBE10",
                        borderRadius: 6,
                        marginLeft: "auto",
                        marginRight: "auto",
                        padding: 15,
                    }}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            color: "white",
                            fontSize: 16,
                            fontWeight: "bold",
                        }}
                    >
                        Register
                    </Text>
                </Pressable>
                <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 15 }}>
                    <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>¿Ya tienes cuenta? Inicia sesion</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({})