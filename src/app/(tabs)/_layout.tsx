import { Tabs } from 'expo-router/tabs';

import { TabBar } from '@/components/tab-bar';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="explorar" />
      <Tabs.Screen name="buscar" />
      <Tabs.Screen name="perfil" />
      <Tabs.Screen name="amigo" />
      <Tabs.Screen name="correio" />
    </Tabs>
  );
}
