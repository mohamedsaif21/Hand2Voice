import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect root to the prototype onboarding screen
  return <Redirect href="/prototype/onboarding" />;
}
