import { Spacing, theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Replace these with your actual Redux selectors

const APP_VERSION = "1.0.0";

// Mock events — replace with your Redux state
const MOCK_EVENTS = [
  { id: "1", name: "Tech Conference 2026" },
  { id: "2", name: "Design Summit" },
  { id: "3", name: "Dev Meetup London" },
  { id: "4", name: "AI Workshop" },
  { id: "5", name: "Startup Expo" },
  { id: "6", name: "Cloud Day" },
];

export default function DrawerContent(props: any) {
  const router = useRouter();

  // Replace with your actual auth selector
  // e.g. const user = useSelector((state: RootState) => state.auth.user);
  const user = null as { username: string } | null;

  const isLoggedIn = !!user;

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Section 1: Auth ───────────────────────────────── */}
      <View style={styles.section}>
        {isLoggedIn ? (
          <TouchableOpacity
            style={styles.profileRow}
            onPress={() => {
              props.navigation.closeDrawer();
              router.push("/Signup");
            }}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.subtext}>View profile →</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              props.navigation.closeDrawer();
              router.push("/Login");
            }}
          >
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      {/* ── Section 2: Events (scrollable) ────────────────── */}
      <View style={styles.sectionFlex}>
        <Text style={styles.sectionLabel}>EVENTS</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventsList}
        >
          {MOCK_EVENTS.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventRow}
              onPress={() => {
                props.navigation.closeDrawer();
                router.push(`/Home`);
              }}
            >
              <View style={styles.eventDot} />
              <Text style={styles.eventName}>{event.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.divider} />

      {/* ── Section 3: About + Version ────────────────────── */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.footerRow}
          onPress={() => {
            props.navigation.closeDrawer();
            router.push("/Home");
          }}
        >
          <Text style={styles.footerLink}>About Us</Text>
        </TouchableOpacity>
        <Text style={styles.version}>v{APP_VERSION}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark,
  },
  // ── Section 1 ──
  section: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.white,
    fontSize: 18,
    fontWeight: "700",
  },
  username: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "600",
  },
  subtext: {
    color: theme.lightGrey,
    fontSize: 12,
    marginTop: 2,
  },
  loginButton: {
    backgroundColor: theme.secondary,
    borderRadius: 8,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    alignSelf: "flex-start",
  },
  loginText: {
    color: theme.white,
    fontWeight: "600",
    fontSize: 14,
  },

  // ── Divider ──
  divider: {
    height: 1,
    backgroundColor: theme.grey,
    marginHorizontal: Spacing.three,
  },

  // ── Section 2 ──
  sectionFlex: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  sectionLabel: {
    color: theme.lightGrey,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: Spacing.two,
  },
  eventsList: {
    gap: 2,
    paddingBottom: Spacing.two,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: 10,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.secondary,
  },
  eventName: {
    color: theme.text,
    fontSize: 14,
  },

  // ── Section 3 ──
  footerRow: {
    marginBottom: Spacing.two,
  },
  footerLink: {
    color: theme.text,
    fontSize: 14,
    fontWeight: "500",
  },
  version: {
    color: theme.lightGrey,
    fontSize: 11,
    marginTop: Spacing.one,
  },
});
