import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  inStock: boolean;
  image: string;
  allergens: string;
};

export default function CoffeeApp() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState<"home" | "menu" | "surprise">("home");
  const [surpriseItem, setSurpriseItem] = useState<MenuItem | null>(null);

 const API_URL = "https://mid-term-mu-steel.vercel.app/";


  // ✅ Fetch all menu items
  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/menu`);
      const data = await res.json();
      setMenuItems(data);
      setScreen("menu");
    } catch (err) {
      console.error("❌ Failed to fetch menu:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch random surprise item
  const fetchSurprise = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/menu/surprise`);
      const data = await res.json();
      setSurpriseItem(data);
      setScreen("surprise");
    } catch (err) {
      console.error("❌ Failed to fetch surprise:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reusable card for menu items
  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : null}
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        {item.allergens ? (
          <Text style={styles.allergens}>{item.allergens}</Text>
        ) : null}
        <Text style={styles.price}>Rs. {item.price}</Text>
        {!item.inStock && <Text style={styles.outOfStock}>Out of Stock</Text>}
      </View>
    </View>
  );

  // ✅ Screen 1: Home screen (two buttons)
  const renderHomeScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>☕ Coffee Shop</Text>

      <TouchableOpacity style={styles.button} onPress={fetchMenu}>
        <Text style={styles.buttonText}>📋 View Full Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonAlt} onPress={fetchSurprise}>
        <Text style={styles.buttonText}>🎁 Surprise Me</Text>
      </TouchableOpacity>
    </View>
  );

  // ✅ Screen 2: Full menu
  const renderMenuScreen = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Full Menu</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => setScreen("home")}>
        <Text style={styles.buttonText}>⬅ Back</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#6F3E18" />
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );

  // ✅ Screen 3: Surprise item
  const renderSurpriseScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Surprise Item 🎉</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => setScreen("home")}>
        <Text style={styles.buttonText}>⬅ Back</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#6F3E18" />
      ) : surpriseItem ? (
        <View style={styles.surpriseBox}>{renderItem({ item: surpriseItem })}</View>
      ) : (
        <Text>No surprise item found.</Text>
      )}
    </View>
  );

  // ✅ Render the correct screen
  if (screen === "home") return renderHomeScreen();
  if (screen === "menu") return renderMenuScreen();
  if (screen === "surprise") return renderSurpriseScreen();
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4B2E05",
  },
  button: {
    backgroundColor: "#6F3E18",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    marginVertical: 10,
  },
  buttonAlt: {
    backgroundColor: "#B85C38",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    marginVertical: 10,
  },
  backButton: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    width: "50%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    width: width * 0.9,
    marginVertical: 8,
    backgroundColor: "#F8F4F0",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  cardContent: { flex: 1, justifyContent: "center" },
  name: { fontSize: 18, fontWeight: "bold" },
  description: { fontSize: 14, color: "#555" },
  allergens: { fontSize: 12, color: "red", marginTop: 2 },
  price: { fontSize: 16, marginTop: 4, fontWeight: "bold" },
  outOfStock: { fontSize: 13, color: "gray" },
  surpriseBox: {
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 20,
    width: "90%",
  },
});
