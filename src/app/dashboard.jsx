import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
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

export default function DashboardScreen() {
  const router = useRouter();

  // Captura os parâmetros enviados na navegação de login
  const params = useLocalSearchParams();
  const usuarioId = params.usuarioId || 1; // Fallback para 1 caso seja teste direto
  const nomeUsuario = params.nomeUsuario || "Usuário";

  const [transacoes, setTransacoes] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("inicio");

  // READ: Busca apenas as transações deste usuário específico
  const carregarTransacoes = async () => {
    try {
      const resposta = await fetch(`${API_URL}/transacoes/${usuarioId}`);
      const dados = await resposta.json();
      setTransacoes(dados);
    } catch (erro) {
      console.error("Erro ao buscar transações:", erro);
    }
  };

  useEffect(() => {
    carregarTransacoes();
  }, [usuarioId]);

  // Ao criar a transação, passamos o usuarioId correto
  const handleSalvarTransacao = async () => {
    if (!descricao || !valor) {
      Alert.alert("Atenção", "Preencha a descrição e o valor.");
      return;
    }

    try {
      if (editandoId) {
        await fetch(`${API_URL}/transacoes/${editandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ descricao, valor: Number(valor) }),
        });
        setEditandoId(null);
      } else {
        await fetch(`${API_URL}/transacoes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: usuarioId,
            descricao,
            valor: Number(valor),
          }),
        });
      }

      setDescricao("");
      setValor("");
      carregarTransacoes();
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
    }
  };

  // EDIT: Carregar dados nos inputs para edição
  const handleEditar = (item) => {
    setDescricao(item.descricao);
    setValor(String(item.valor));
    setEditandoId(item.id);
  };

  // DELETE: Remover transação
  const handleDeletar = async (id) => {
    try {
      const resposta = await fetch(`${API_URL}/transacoes/${id}`, {
        method: "DELETE",
      });

      if (resposta.ok) {
        carregarTransacoes();
      } else {
        Alert.alert("Erro", "Não foi possível deletar.");
      }
    } catch (erro) {
      console.error("Erro ao deletar:", erro);
    }
  };

  // Cálculos financeiros
  const receitasTotais = transacoes
    .filter((i) => Number(i.valor) > 0)
    .reduce((acc, i) => acc + Number(i.valor), 0);
  const despesasTotais = transacoes
    .filter((i) => Number(i.valor) < 0)
    .reduce((acc, i) => acc + Number(i.valor), 0);
  const saldoTotal = receitasTotais + despesasTotais;

  // Maiores gastos ordenados para a aba de relatório
  const maioresGastos = [...transacoes]
    .filter((i) => Number(i.valor) < 0)
    .sort((a, b) => Number(a.valor) - Number(b.valor));

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      {/* Header com o Saldo Total */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: currentTheme.card,
            borderColor: currentTheme.border,
          },
        ]}
      >
        <Text
          style={[styles.welcomeText, { color: currentTheme.textSecondary }]}
        >
          WellControled 🚀
        </Text>
        <Text
          style={[styles.balanceTitle, { color: currentTheme.textSecondary }]}
        >
          Saldo Disponível
        </Text>
        <Text
          style={[
            styles.balanceValue,
            {
              color:
                saldoTotal >= 0 ? currentTheme.primary : currentTheme.danger,
            },
          ]}
        >
          R$ {saldoTotal.toFixed(2)}
        </Text>

        <View style={styles.subInfoContainer}>
          <Text style={{ color: currentTheme.primary }}>
            Entradas: R$ {receitasTotais.toFixed(2)}
          </Text>
          <Text style={{ color: currentTheme.danger }}>
            Saídas: R$ {Math.abs(despesasTotais).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Navegação por Abas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            abaAtiva === "inicio" && {
              borderBottomColor: currentTheme.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setAbaAtiva("inicio")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  abaAtiva === "inicio"
                    ? currentTheme.textPrimary
                    : currentTheme.textSecondary,
              },
            ]}
          >
            Transações
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            abaAtiva === "relatorio" && {
              borderBottomColor: currentTheme.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setAbaAtiva("relatorio")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  abaAtiva === "relatorio"
                    ? currentTheme.textPrimary
                    : currentTheme.textSecondary,
              },
            ]}
          >
            Relatório de Gastos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo Dinâmico por Aba */}
      {abaAtiva === "inicio" ? (
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <Input
              placeholder="Descrição (ex: Conta de Luz)"
              value={descricao}
              onChangeText={setDescricao}
            />
            <Input
              placeholder="Valor (ex: -150.00 ou 2000)"
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
            />
            <Button
              title={editandoId ? "Atualizar Transação" : "Adicionar Transação"}
              onPress={handleSalvarTransacao}
            />
          </View>

          <Text
            style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}
          >
            Histórico
          </Text>

          <FlatList
            data={transacoes}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: currentTheme.card,
                    borderColor: currentTheme.border,
                  },
                ]}
              >
                <View>
                  <Text
                    style={[
                      styles.itemText,
                      { color: currentTheme.textPrimary },
                    ]}
                  >
                    {item.descricao}
                  </Text>
                  <Text
                    style={[
                      styles.itemValue,
                      {
                        color:
                          Number(item.valor) >= 0
                            ? currentTheme.primary
                            : currentTheme.danger,
                      },
                    ]}
                  >
                    R$ {item.valor}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleEditar(item)}>
                    <Text style={styles.actionEdit}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeletar(item.id)}>
                    <Text style={styles.actionDelete}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <Text
            style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}
          >
            Maiores Despesas do Mês
          </Text>
          <FlatList
            data={maioresGastos}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: currentTheme.card,
                    borderColor: currentTheme.border,
                  },
                ]}
              >
                <View>
                  <Text
                    style={[
                      styles.itemText,
                      { color: currentTheme.textPrimary },
                    ]}
                  >
                    #{index + 1} - {item.descricao}
                  </Text>
                  <Text
                    style={[styles.itemValue, { color: currentTheme.danger }]}
                  >
                    R$ {item.valor}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* Botão de Sair fixo no rodapé */}
      <View style={styles.footerButtonContainer}>
        <Button
          title="Sair do App"
          variant="danger"
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
  },
  welcomeText: { fontSize: 12, marginBottom: 2 },
  balanceTitle: { fontSize: 14, fontWeight: "600" },
  balanceValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 8,
  },
  subInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#263449",
  },
  tabButton: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabText: { fontSize: 14, fontWeight: "bold" },
  content: { flex: 1, padding: 20 },
  formContainer: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  itemText: { fontSize: 15, fontWeight: "bold" },
  itemValue: { fontSize: 14, marginTop: 4 },
  actions: { flexDirection: "row", gap: 12 },
  actionEdit: { color: "#34D399", fontWeight: "bold" },
  actionDelete: { color: "#EF4444", fontWeight: "bold" },
  footerButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#263449",
  },
});
