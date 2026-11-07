import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      {/* Deixa a barra de status do celular clara/visível no fundo escuro */}
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false, // Oculta o cabeçalho padrão em todas as telas
          contentStyle: { backgroundColor: "#0B1120" }, // Garante o fundo padrão da paleta Dark
        }}
      />
    </>
  );
}
