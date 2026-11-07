import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Colors } from "../constants/colors";
import { API_URL } from "../services/api";

const currentTheme = Colors.dark;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Exemplo de rota de login no back-end que valida e retorna o usuário
      const resposta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // Passamos o id do usuário logado via parâmetro de rota do Expo Router!
        router.push({
          pathname: "/dashboard",
          params: {
            usuarioId: dados.usuario.id,
            nomeUsuario: dados.usuario.nome,
          },
        });
      } else {
        Alert.alert("Erro", dados.erro || "E-mail ou senha incorretos.");
      }
    } catch (erro) {
      console.error("Erro no login:", erro);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      {/* Exibindo a sua Logo */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Input
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Button title="Entrar" onPress={handleLogin} />
      <TouchableOpacity
        onPress={() => router.push("/register")}
        style={{ marginTop: 15, alignItems: "center" }}
      >
        <Text style={{ color: currentTheme.textSecondary }}>
          Não tem uma conta?{" "}
          <Text style={{ color: currentTheme.primary, fontWeight: "bold" }}>
            Cadastre-se
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: "100%",
    height: 90,
    marginBottom: 40,
  },
});
