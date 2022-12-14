import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameParams } from '../../@types/navigation';
import { Background } from '../../components/Background';
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { DuoMatch } from '../../components/DuoMatch';
import { Entypo } from '@expo/vector-icons';

import { THEME } from '../../theme';

import logo from '../../assets/logo-nlw-esports.png';

import { styles } from './styles';

export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([])
  const [discordSelected, setDiscordSelected] = useState('')
  const route = useRoute();
  const game = route.params as GameParams;

  const navigation = useNavigation();

  useEffect(() => {
    fetch(`http://192.168.1.10:3333/games/${game.id}/ads`)
      .then(response => response.json())
      .then(data => setDuos(data))
  }, [])

  const getDiscord = async (adsId: string) => {
    await fetch(`http://192.168.1.10:3333/ads/${adsId}/discord`)
      .then(response => response.json())
      .then(data => setDiscordSelected(data.discord))
  }
  
  const handleGoBack = () => {
    navigation.goBack();
  }

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image
            source={logo}
            style={styles.logo}
          />

          <View style={styles.right} />
        </View>

        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />

        <Heading
          title={game.title}
          subtitle="Conecte-se e comece a jogar!"
        />

        <FlatList
          data={duos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DuoCard data={item} onConnect={() => getDiscord(item.id)} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[duos.length > 0 ? styles.list : styles.emptyList]}
          style={styles.containerList}
          ListEmptyComponent={() => <Text style={styles.empty}>N??o h?? an??ncios publicados para esse jogo ainda.</Text>}
        />
      </SafeAreaView>

      <DuoMatch
        visible={discordSelected.length > 0}
        discord={discordSelected}
        onClose={() => setSelected('')}
      />
    </Background>
  );
}