import Loading from '../../components/Loading';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function TabLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (you can adjust the timeout duration)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Shows loading screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="add" options={{ headerShown: false }} />
        </Stack>
      )}
    </>
  );
}