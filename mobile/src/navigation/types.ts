export type RootStackParamList = {
  Login: undefined;
    Signup: undefined;

  MainTabs: undefined;
  Weather: undefined;
  // Add other screen params here if needed
};

export type TabParamList = {
  Discover: undefined;
  Matches: undefined;
  Likes: undefined;
  Messages: undefined;
  Profile: undefined;
};

// This helps with type checking the navigation prop in components
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
