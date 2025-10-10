// =====================
// IMPORTAÇÕES PRINCIPAIS
// =====================
// Importa React e hooks de estado e efeito
import React, { useState, useEffect, useCallback } from 'react';
// Importa componentes básicos do React Native
import { View, FlatList, RefreshControl, Image, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
// Importa componentes da biblioteca React Native Paper para UI mais rica
import { 
  Provider as PaperProvider, Appbar, Card, Button, ActivityIndicator, Text, FAB, Avatar, DefaultTheme 
} from 'react-native-paper';
// Importa navegação
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importa cliente Supabase
import { createClient } from '@supabase/supabase-js';

// =====================
// CONFIGURAÇÃO DO SUPABASE
// =====================
// URL e chave anônima do Supabase (substituir pelos seus dados)
const SUPABASE_URL = 'https://yaknmklxayqmxrnmvbkq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlha25ta2x4YXlxbXhybm12YmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzYxOTMsImV4cCI6MjA3NTAxMjE5M30.Iz7pfQEb3dbHtKWWKjLHxPWXUJAHET2zW4tcE8WUTDI';
// Cria o cliente Supabase para interagir com o banco de dados
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================
// NAVEGAÇÃO
// =====================
// Cria a pilha de navegação
const Stack = createNativeStackNavigator();

// =====================
// TEMA
// =====================
// Personaliza o tema padrão do React Native Paper
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6C2BD9',   // cor principal (roxo)
    accent: '#6C2BD9',    // cor secundária
    background: '#FFFFFF', // fundo branco
    surface: '#FFFFFF',
    text: '#222222'       // texto escuro
  }
};

// =====================
// SPLASHSCREEN
// =====================
// Tela inicial com logo e loader
function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <Avatar.Icon size={96} icon="book-open-variant" style={{ backgroundColor: 'transparent' }} color="#6C2BD9" />
      <Text variant="headlineLarge" style={{ marginTop: 12, color: '#6C2BD9', fontWeight: '700' }}>Meus Mangás</Text>
      <ActivityIndicator animating size="large" style={{ marginTop: 18 }} />
    </View>
  );
}

// =====================
// HOMESCREEN
// =====================
// Tela principal com lista de mangás, busca e botão para adicionar
function HomeScreen({ navigation }) {
  // Estados
  const [mangas, setMangas] = useState([]);       // lista de mangás
  const [loading, setLoading] = useState(true);   // indicador de carregamento
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh
  const [search, setSearch] = useState('');       // texto da busca

  // Função para buscar mangás do Supabase
  const fetchMangas = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('mangas').select('*').order('id', { ascending: true });
      if (error) throw error;
      setMangas(data || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar seus mangás.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca os mangás ao montar o componente
  useEffect(() => { fetchMangas(); }, [fetchMangas]);

  // Função para atualizar lista via pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMangas();
    setRefreshing(false);
  }, [fetchMangas]);

  // Filtra a lista de mangás pelo título, autor ou ISBN
  const filteredMangas = mangas.filter((m) =>
    m.title?.toLowerCase().includes(search.toLowerCase()) ||
    m.author?.toLowerCase().includes(search.toLowerCase()) ||
    m.isbn?.toLowerCase().includes(search.toLowerCase())
  );

  // Renderiza cada item da lista (Card)
  const renderManga = ({ item }) => (
    <Card style={{ margin: 8 }} onPress={() => navigation.navigate('Details', { id: item.id })}>
      {item.cover_url ? (
        <Card.Cover source={{ uri: item.cover_url }} />
      ) : (
        <View style={styles.emptyCover}><Text>Sem capa</Text></View>
      )}
      <Card.Title
        title={item.title || `Mangá ${item.id}`}
        subtitle={`${item.author ?? '-'} - ${item.edition ?? '-'} - Vol. ${item.volume ?? '-'}`}
      />
      <Card.Content>
        <Text>{item.genre ? `Gênero: ${item.genre}` : ''}</Text>
        <Text>{item.isbn ? `ISBN: ${item.isbn}` : ''}</Text>
        {item.release_date && <Text>Data de lançamento: {item.release_date}</Text>}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate('Details', { id: item.id })}>Ver detalhes</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Barra superior */}
      <Appbar.Header>
        <Appbar.Content title="Meus Mangás" />
        <Appbar.Action icon="refresh" onPress={onRefresh} accessibilityLabel="Atualizar" />
      </Appbar.Header>

      {/* Campo de busca */}
      <TextInput
        placeholder="Pesquisar por título, autor ou ISBN..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      {/* Lista de mangás ou indicador de carregamento */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredMangas}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderManga}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={{ margin: 16 }}>Nenhum mangá encontrado — adicione o primeiro!</Text>}
        />
      )}

      {/* Botão flutuante para adicionar mangá */}
      <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('Create')} label="Adicionar Mangá" />
    </View>
  );
}

// =====================
// DETAILSSCREEN
// =====================
// Tela que exibe detalhes completos de um mangá e permite editar
function DetailsScreen({ route, navigation }) {
  const { id } = route.params || {};       // pega id do mangá passado na navegação
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar o mangá específico
  const fetchManga = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('mangas').select('*').eq('id', id).single();
      if (error) throw error;
      setManga(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar o mangá');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchManga(); }, [fetchManga]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={manga?.title || `Mangá #${id}`} />
      </Appbar.Header>

      {/* Conteúdo */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating size="large" />
        </View>
      ) : manga ? (
        <ScrollView style={{ padding: 16 }}>
          {/* Capa */}
          {manga.cover_url && <Image source={{ uri: manga.cover_url }} style={{ width: '100%', height: 260, marginBottom: 16 }} resizeMode="cover" />}
          <Text variant="titleLarge" style={{ marginBottom: 8 }}>{manga.title}</Text>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            {`${manga.author ?? '-'} - ${manga.edition ?? '-'} - Vol. ${manga.volume ?? '-'}`}
          </Text>

          <Text style={{ marginBottom: 6 }}>Gênero: {manga.genre ?? '-'}</Text>
          <Text style={{ marginBottom: 6 }}>ISBN: {manga.isbn ?? '-'}</Text>
          {manga.release_date && <Text style={{ marginBottom: 12 }}>Data de lançamento: {manga.release_date}</Text>}

          {/* Botão de edição */}
          <Button mode="contained" onPress={() => navigation.navigate('Create', { manga })}>
            Editar Mangá
          </Button>
        </ScrollView>
      ) : (
        <Text style={{ margin: 16 }}>Mangá não encontrado.</Text>
      )}
    </View>
  );
}

// =====================
// CREATESCREEN (Adicionar ou Editar)
// =====================
function CreateScreen({ route, navigation }) {
  const editingManga = route.params?.manga || null; // verifica se está editando

  // Estados para formulário, pré-preenchidos caso esteja editando
  const [title, setTitle] = useState(editingManga?.title ?? '');
  const [author, setAuthor] = useState(editingManga?.author ?? '');
  const [edition, setEdition] = useState(editingManga?.edition ?? '');
  const [volume, setVolume] = useState(editingManga?.volume?.toString() ?? '');
  const [genre, setGenre] = useState(editingManga?.genre ?? '');
  const [releaseDate, setReleaseDate] = useState(editingManga?.release_date ?? '');
  const [coverUrl, setCoverUrl] = useState(editingManga?.cover_url ?? '');
  const [isbn, setIsbn] = useState(editingManga?.isbn ?? '');
  const [submitting, setSubmitting] = useState(false);

  // Valida formato MM/YYYY
  const validarMesAno = (value) => /^(0[1-9]|1[0-2])\/\d{4}$/.test(value);

  // Função para enviar dados
  const onSubmit = async () => {
    if (!title) { Alert.alert('Erro', 'O título é obrigatório'); return; }
    if (releaseDate && !validarMesAno(releaseDate)) {
      Alert.alert('Erro', 'Data de lançamento deve estar no formato MM/YYYY (ex: 10/2025)'); return;
    }

    setSubmitting(true);
    const volumeNum = volume ? parseInt(volume, 10) : null;

    try {
      const payload = { title, author, volume: volumeNum, genre, isbn, edition, release_date: releaseDate || null, cover_url: coverUrl || null };

      if (editingManga) {
        // Atualiza mangá existente
        const { error } = await supabase.from('mangas').update(payload).eq('id', editingManga.id);
        if (error) throw error;
        Alert.alert('Sucesso', 'Mangá atualizado com sucesso!');
      } else {
        // Adiciona novo mangá
        const { error } = await supabase.from('mangas').insert([payload]);
        if (error) throw error;
        Alert.alert('Sucesso', 'Mangá adicionado com sucesso!');
      }

      setSubmitting(false);
      navigation.navigate('Home');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível salvar o mangá');
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ paddingBottom: 24 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={editingManga ? "Editar Mangá" : "Adicionar Mangá"} />
      </Appbar.Header>

      {/* Campos do formulário */}
      <TextInput placeholder="Título" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Autor" value={author} onChangeText={setAuthor} style={styles.input} />
      <TextInput placeholder="Edição (ex: Big, Especial)" value={edition} onChangeText={setEdition} style={styles.input} />
      <TextInput placeholder="Volume (número)" value={volume} onChangeText={setVolume} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Gênero" value={genre} onChangeText={setGenre} style={styles.input} />
      <TextInput placeholder="Mês/Ano (ex: 10/2025)" value={releaseDate} onChangeText={setReleaseDate} style={styles.input} />
      <TextInput placeholder="ISBN" value={isbn} onChangeText={setIsbn} style={styles.input} />
      <TextInput placeholder="URL da capa" value={coverUrl} onChangeText={setCoverUrl} style={styles.input} />

      {/* Botão de envio */}
      <Button mode="contained" onPress={onSubmit} loading={submitting} style={{ marginTop: 8 }}>
        {submitting ? 'Enviando...' : editingManga ? 'Salvar Alterações' : 'Enviar'}
      </Button>
    </ScrollView>
  );
}

// =====================
// COMPONENTE RAIZ APP
// =====================
export default function App() {
  const [showSplash, setShowSplash] = useState(true); // controla se exibe splash screen

  // Esconde splash após 800ms
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) return <PaperProvider theme={theme}><SplashScreen /></PaperProvider>;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Create" component={CreateScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// =====================
// ESTILOS
// =====================
const styles = StyleSheet.create({
  splashContainer: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#6C2BD9' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 8, padding: 10, borderRadius: 6, backgroundColor: '#fff' },
  emptyCover: { height: 180, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f6fb' }
});
