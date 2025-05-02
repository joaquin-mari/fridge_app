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
import * as ExpoCamera from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ScannerScreen() {
  const isFocused = useIsFocused();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const cameraRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState("back"); // Use string values instead of enums
  const [flashMode, setFlashMode] = useState("off"); // Use string values instead of enums
  const [capturedImage, setCapturedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [filters, setFilters] = useState([
    { id: 1, name: "Meal", active: true },
    { id: 2, name: "Snack", active: false },
    { id: 3, name: "Drink", active: false },
    { id: 4, name: "Dessert", active: false },
  ]);

  // Initialize camera when screen is focused
  useEffect(() => {
    let mounted = true;

    if (isFocused) {
      (async () => {
        const { status } = await ExpoCamera.requestCameraPermissionsAsync();
        if (mounted) {
          setHasPermission(status === "granted");
        }

        try {
          await MediaLibrary.requestPermissionsAsync();
        } catch (error) {
          console.log("Media library permission error:", error);
          // Continue without media library permissions
        }
      })();
    }

    return () => {
      mounted = false;
    };
  }, [isFocused]);

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
    setCameraType(cameraType === "back" ? "front" : "back");
  };

  const toggleFlash = () => {
    setFlashMode(flashMode === "off" ? "on" : "off");
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

  // Simplified navigation to gallery using router
  const navigateToGallery = () => {
    try {
      router.push("/gallery");
    } catch (error) {
      console.warn("Navigation error:", error);
      Alert.alert("Gallery", "Gallery screen will be implemented soon");
    }
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
            onPress={() => {
              router.push("/home");
            }}
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
              {/* Camera with string-based props instead of enums */}
              <ExpoCamera.Camera
                ref={cameraRef}
                style={styles.camera}
                type={cameraType}
                flashMode={flashMode}
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
                    onPress={() => {
                      router.push("/home");
                    }}
                  >
                    <Ionicons name="arrow-back" size={24} color="white" />
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
                  <TouchableOpacity
                    style={styles.footerButton}
                    onPress={toggleFlash}
                  >
                    <Ionicons
                      name={flashMode === "on" ? "flash" : "flash-off"}
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>

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
              </ExpoCamera.Camera>
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
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
  },
  cameraHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraHeaderTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  filterContainer: {
    position: "absolute",
    top: Platform.OS === "android" ? 100 : 80,
    left: 0,
    right: 0,
  },
  filterScroll: {
    paddingHorizontal: 15,
  },
  filterButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  activeFilterButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  filterText: {
    color: "white",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "white",
    fontWeight: "600",
  },
  cameraFooter: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  footerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "500",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
  },
  previewHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewHeaderTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  previewImage: {
    flex: 1,
    width: screenWidth,
    height: undefined,
  },
  previewFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
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
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  errorText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  errorSubtext: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
  },
  backButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
