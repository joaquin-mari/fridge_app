// app/(tabs)/scanner.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router"; // Import useRouter from expo-router instead

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ScannerScreen() {
  const isFocused = useIsFocused();
  const router = useRouter(); // Use Expo Router's hook instead of React Navigation's
  const colorScheme = useColorScheme();
  const cameraRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [filters, setFilters] = useState([
    { id: 1, name: "Meal", active: true },
    { id: 2, name: "Snack", active: false },
    { id: 3, name: "Drink", active: false },
    { id: 4, name: "Dessert", active: false },
  ]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      try {
        await MediaLibrary.requestPermissionsAsync();
      } catch (error) {
        console.log("Media library permission error:", error);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      setProcessing(true);

      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: false,
        });

        const resizedPhoto = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        if (Platform.OS !== "web") {
          try {
            await MediaLibrary.saveToLibraryAsync(resizedPhoto.uri);
          } catch (err) {
            console.log("Failed to save to library:", err);
            // Continue without saving to library since this might be due to permissions
          }
        }

        setCapturedImage(resizedPhoto.uri);
        setProcessing(false);
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to capture image");
        setProcessing(false);
      }
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleFlash = () => {
    setFlashMode(flashMode === FlashMode.off ? FlashMode.on : FlashMode.off);
  };

  const selectFilter = (id) => {
    const updatedFilters = filters.map((filter) => ({
      ...filter,
      active: filter.id === id,
    }));
    setFilters(updatedFilters);
  };

  const sendToBackend = () => {
    Alert.alert(
      "Processing",
      "Your food image will be analyzed by our system.",
      [{ text: "OK", onPress: resetCamera }]
    );
  };

  // Use router to navigate to other screens
  const navigateToGallery = () => {
    // This is the Expo Router way to navigate
    router.push("/gallery");
    // If gallery doesn't exist yet, show an alert instead
    // Alert.alert("Gallery", "Gallery screen will be implemented soon");
  };

  // Go back function using Expo Router
  const goBack = () => {
    router.back(); // This is the correct way to go back with Expo Router
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>
            Requesting camera permission...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="camera-off-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>No access to camera</Text>
          <Text style={styles.errorSubtext}>
            Please enable camera access in your device settings to use the
            scanner.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/home")}
          >
            <Text style={styles.backButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <TouchableOpacity
              style={styles.previewHeaderButton}
              onPress={resetCamera}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.previewHeaderTitle}>Food Preview</Text>
            <View style={styles.previewHeaderButton} />
          </View>

          <Image
            source={{ uri: capturedImage }}
            style={styles.previewImage}
            resizeMode="cover"
          />

          <View style={styles.previewFooter}>
            <TouchableOpacity style={styles.retakeButton} onPress={resetCamera}>
              <Ionicons name="refresh-outline" size={22} color="white" />
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sendButton} onPress={sendToBackend}>
              <Ionicons name="arrow-forward-outline" size={22} color="white" />
              <Text style={styles.buttonText}>Analyze</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {isFocused && (
            <View style={styles.cameraContainer}>
              <Camera
                ref={cameraRef}
                style={styles.camera}
                type={cameraType}
                flashMode={flashMode}
                ratio="16:9"
              >
                {processing && (
                  <View style={styles.processingOverlay}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.processingText}>
                      Processing image...
                    </Text>
                  </View>
                )}

                <View style={styles.cameraHeader}>
                  <TouchableOpacity
                    style={styles.cameraHeaderButton}
                    onPress={toggleFlash}
                  >
                    <Ionicons
                      name={flashMode === FlashMode.on ? "flash" : "flash-off"}
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>

                  <Text style={styles.cameraHeaderTitle}>Food Scanner</Text>

                  <TouchableOpacity
                    style={styles.cameraHeaderButton}
                    onPress={toggleCameraType}
                  >
                    <Ionicons name="camera-reverse" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                <View style={styles.filterContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                  >
                    {filters.map((filter) => (
                      <TouchableOpacity
                        key={filter.id}
                        style={[
                          styles.filterButton,
                          filter.active && styles.activeFilterButton,
                        ]}
                        onPress={() => selectFilter(filter.id)}
                      >
                        <Text
                          style={[
                            styles.filterText,
                            filter.active && styles.activeFilterText,
                          ]}
                        >
                          {filter.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.cameraFooter}>
                  <View style={styles.footerButton} />

                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={takePicture}
                    disabled={processing}
                  >
                    <View style={styles.captureButtonInner} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.footerButton}
                    onPress={navigateToGallery}
                  >
                    <Ionicons name="images-outline" size={28} color="white" />
                  </TouchableOpacity>
                </View>
              </Camera>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    color: "white",
    fontSize: 16,
    marginTop: 12,
  },
  cameraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  cameraHeaderButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraHeaderTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 15,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    marginHorizontal: 5,
  },
  activeFilterButton: {
    backgroundColor: "#4CAF50",
  },
  filterText: {
    color: "white",
    fontSize: 14,
  },
  activeFilterText: {
    fontWeight: "bold",
  },
  cameraFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 30,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  footerButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  previewHeaderButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  previewHeaderTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewImage: {
    flex: 1,
    width: "100%",
  },
  previewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#555",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
  },
});
