import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { inboxFor } from '@/data/mail';
import { useApp } from '@/store/app-store';
import { colors, fonts, radii } from '@/theme';

export default function CorreioScreen() {
  const { state } = useApp();
  const [open, setOpen] = useState<string | null>(null);
  const messages = inboxFor(state.childName);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={<Text style={styles.title}>Correio</Text>}
        renderItem={({ item }) => {
          const expanded = open === item.id;
          return (
            <Pressable
              onPress={() => setOpen(expanded ? null : item.id)}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              style={styles.card}>
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.from}>{item.from}</Text>
                  <Text style={styles.msgTitle}>{item.title}</Text>
                </View>
              </View>
              {expanded ? <Text style={styles.body}>{item.body}</Text> : null}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primarySoft },
  title: { fontFamily: fonts.title, fontSize: 30, color: colors.text, marginBottom: 4 },
  card: { backgroundColor: colors.white, borderRadius: radii.cardLarge, padding: 16, gap: 10 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  from: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary },
  msgTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23, color: colors.text },
});
