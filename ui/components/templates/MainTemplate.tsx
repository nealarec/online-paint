import React, { ReactNode } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Header } from "../organisms/Header";

interface MainTemplateProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon?: React.ReactNode;
    onPress: () => void;
  };
  scrollable?: boolean;
  safeArea?: boolean;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({
  children,
  title = "",
  showBackButton = false,
  onBackPress,
  rightAction,
  scrollable = true,
  safeArea = true,
}) => {
  const Wrapper = scrollable ? ScrollView : View;
  const Container = safeArea ? SafeAreaView : View;

  return (
    <Container style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header
        title={title}
        showBackButton={showBackButton}
        onBackPress={onBackPress}
        rightAction={rightAction}
      />
      <Wrapper
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Wrapper>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
});
