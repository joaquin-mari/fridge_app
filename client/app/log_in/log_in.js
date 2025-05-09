// app/(auth)/login.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "../../apis/supabaseClient";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    
    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Navigate to main app
      router.replace("/(tabs)/profile");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Logo and Branding */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="nutrition" size={50} color="#4CAF50" />
          </View>
          <Text style={styles.appTitle}>NutriFridge</Text>
          <Text style={styles.appTagline}>Track your nutrition journey</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPasswordLink}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>
          
          <TouchableOpacity 
            style={styles.signupLink}
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text style={styles.signupText}>
              Don't have an account? <Text style={styles.signupHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// app/(auth)/signup.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { supabase } from "../../apis/supabaseClient";

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    gender: "",
    height: "",
    weight: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // For multi-step form
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Available interests from your database
  const availableInterests = [
    { id: 1, name: "Healthy Eating" },
    { id: 2, name: "Weight Loss" },
    { id: 3, name: "Muscle Building" },
    { id: 4, name: "Vegan" },
    { id: 5, name: "Vegetarian" },
    { id: 6, name: "Paleo" },
    { id: 7, name: "Keto" },
    { id: 8, name: "Meal Prep" },
  ];

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleInterest = (interestId) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const validateStep1 = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    // Height and weight can be optional, but if provided should be numbers
    if (formData.height && isNaN(parseFloat(formData.height))) {
      setError("Height must be a number");
      return false;
    }
    if (formData.weight && isNaN(parseFloat(formData.weight))) {
      setError("Weight must be a number");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError(null);
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSignup = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      
      // 2. Create user profile in the database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id, // Assuming you tie auth.id to users.id
          email: formData.email,
          name: formData.name,
          gender: formData.gender,
          height: formData.height ? parseFloat(formData.height) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
        })
        .select()
        .single();
      
      if (userError) throw userError;
      
      // 3. Create empty fridge for the user
      const { error: fridgeError } = await supabase
        .from("fridge")
        .insert({
          user_id: userData.id,
        });
      
      if (fridgeError) throw fridgeError;
      
      // 4. Add selected interests
      if (selectedInterests.length > 0) {
        const interestRecords = selectedInterests.map(interestId => ({
          user_id: userData.id,
          interest_id: interestId
        }));
        
        const { error: interestsError } = await supabase
          .from("user_interest")
          .insert(interestRecords);
        
        if (interestsError) throw interestsError;
      }
      
      // Show success message and navigate to login
      Alert.alert(
        "Account Created",
        "Your account has been created successfully! Please sign in.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
      );
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.formTitle}>Create Account</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={22} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={formData.email}
                onChangeText={(text) => updateFormData("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={22} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.name}
                onChangeText={(text) => updateFormData("name", text)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => updateFormData("password", text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData("confirmPassword", text)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.formTitle}>Your Profile</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="body-outline" size={22} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Gender (optional)"
                value={formData.gender}
                onChangeText={(text) => updateFormData("gender", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="resize-outline" size={22} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Height in cm (optional)"
                value={formData.height}
                onChangeText={(text) => updateFormData("height", text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="fitness-outline" size={22} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Weight in kg (optional)"
                value={formData.weight}
                onChangeText={(text) => updateFormData("weight", text)}
                keyboardType="numeric"
              />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.formTitle}>Your Interests</Text>
            <Text style={styles.interestsSubtitle}>Choose topics that interest you</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.interestTagsContainer}>
              {availableInterests.map((interest) => (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestTag,
                    selectedInterests.includes(interest.id) && styles.interestTagSelected
                  ]}
                  onPress={() => toggleInterest(interest.id)}
                >
                  <Text 
                    style={[
                      styles.interestTagText,
                      selectedInterests.includes(interest.id) && styles.interestTagTextSelected
                    ]}
                  >
                    {interest.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.interestNote}>
              You can always update your interests later
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  const renderButtons = () => {
    if (step === 1) {
      return (
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNextStep}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      );
    } else if (step === 2) {
      return (
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handlePrevStep}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={20} color="#4CAF50" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNextStep}
            disabled={loading}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      );
    } else if (step === 3) {
      return (
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handlePrevStep}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={20} color="#4CAF50" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.createAccountButton}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={styles.createAccountButtonText}>Create Account</Text>
                <Ionicons name="checkmark" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Branding */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Ionicons name="nutrition" size={50} color="#4CAF50" />
            </View>
            <Text style={styles.appTitle}>NutriFridge</Text>
            <Text style={styles.appTagline}>Track your nutrition journey</Text>
          </View>

          {/* Form with steps indicator */}
          <View style={styles.formContainer}>
            <View style={styles.stepsContainer}>
              <View style={[styles.stepIndicator, step >= 1 && styles.activeStep]}>
                <Text style={[styles.stepNumber, step >= 1 && styles.activeStepNumber]}>1</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={[styles.stepIndicator, step >= 2 && styles.activeStep]}>
                <Text style={[styles.stepNumber, step >= 2 && styles.activeStepNumber]}>2</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={[styles.stepIndicator, step >= 3 && styles.activeStep]}>
                <Text style={[styles.stepNumber, step >= 3 && styles.activeStepNumber]}>3</Text>
              </View>
            </View>

            {renderFormStep()}
            
            {renderButtons()}
            
            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginHighlight}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Shared styles for both screens
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: "#F8FFF8",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEFFF0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  appTagline: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  interestsSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: -10,
    marginBottom: 20,
    textAlign: "center",
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EEFFF0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D7F0DB",
  },
  activeStep: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  stepNumber: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  activeStepNumber: {
    color: "white",
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D7F0DB",
    maxWidth: 50,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: "#333",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#4CAF50",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#EBEBEB",
  },
  dividerText: {
    color: "#999",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  signupLink: {
    alignItems: "center",
    marginTop: 8,
  },
  signupText: {
    color: "#666",
    fontSize: 15,
  },
  signupHighlight: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  loginLink: {
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#666",
    fontSize: 15,
  },
  loginHighlight: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    marginLeft: 8,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  backButton: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    marginRight: 8,
  },
  backButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  createAccountButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    marginLeft: 8,
  },
  createAccountButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  interestTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  interestTag: {
    backgroundColor: "#EEFFF0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#D7F0DB",
  },
  interestTagSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  interestTagText: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  interestTagTextSelected: {
    color: "white",
  },
  interestNote: {
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
});