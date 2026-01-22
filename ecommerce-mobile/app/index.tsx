import { Redirect } from 'expo-router';
import { useAuth } from '@/store/authStore';

export default function Index() {
  const isLoggedIn = useAuth((s) => !!s.token);

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
