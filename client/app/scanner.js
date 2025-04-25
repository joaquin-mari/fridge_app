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

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ScannerScreen() {
  const isFocused = useIsFocused();
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

      await MediaLibrary.requestPermissionsAsync();
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
          await MediaLibrary.saveToLibraryAsync(resizedPhoto.uri);
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
    // Here you would add code to send the image to your backend
    Alert.alert(
      "Processing",
      "Your food image will be analyzed by our system.",
      [{ text: "OK", onPress: resetCamera }]
    );
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

                  <TouchableOpacity style={styles.footerButton}>
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
    backgroundColor: "#000000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  errorSubtext: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  cameraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  cameraHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraHeaderTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  filterContainer: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
  },
  filterScroll: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  activeFilterButton: {
    backgroundColor: "#4CAF50",
  },
  filterText: {
    color: "white",
    fontWeight: "500",
  },
  activeFilterText: {
    fontWeight: "bold",
  },
  cameraFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  footerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    borderWidth: 2,
    borderColor: "#4CAF50",
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
    marginTop: 16,
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
    paddingTop: 20,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  previewHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewHeaderTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  previewImage: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  previewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 30,
    paddingHorizontal: 30,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 20,
  },
  retakeButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
