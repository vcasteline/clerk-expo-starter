import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, TouchableOpacity, Image } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { styles } from "./Styles";
import { useWamUpBrowser } from "../hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export function OAuthButtons() {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWamUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <TouchableOpacity
      style={{
        ...styles.secondaryButton,
        marginBottom: 20,
        flexDirection: "row",
      }}
      onPress={onPress}
    >
      <Image
        source={require("../assets/google-icon.png")}
        style={{ width: 30, height: 30, marginRight:10 }}
      />
      <Text style={styles.secondaryButtonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
}
