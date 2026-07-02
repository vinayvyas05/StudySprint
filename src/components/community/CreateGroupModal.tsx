import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  PanResponder,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  existingCategories: string[];
  onClose: () => void;
  onCreate: (name: string, description: string, category: string) => Promise<void>;
  isLoading: boolean;
};

const STEP_META = [
  { icon: "text-outline" as const, label: "Name" },
  { icon: "document-text-outline" as const, label: "About" },
  { icon: "pricetag-outline" as const, label: "Category" },
];

export default function CreateGroupModal({
  visible,
  existingCategories,
  onClose,
  onCreate,
  isLoading,
}: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const isNameValid = name.trim().length >= 3;
  const isDescValid = description.trim().length >= 5;
  const isCatValid = category.trim().length >= 2;

  const handleNext = () => {
    if (step === 1 && isNameValid) setStep(2);
    else if (step === 2 && isDescValid) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = async () => {
    if (!isNameValid || !isDescValid || !isCatValid || isLoading) return;

    await onCreate(name.trim(), description.trim(), category.trim());

    handleClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setCategory("");
    setStep(1);
    onClose();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 50) {
          handleClose();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={handleClose} 
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="justify-end"
        >
          <View
            className="rounded-t-[36px] px-8 pt-4 border-t border-white/[0.06]"
            style={{ backgroundColor: "#121212", maxHeight: SCREEN_HEIGHT * 0.78 }}
          >
            {/* Drag handle */}
            <View {...panResponder.panHandlers} className="items-center pb-5 pt-2 w-full">
              <View className="w-12 h-1.5 rounded-full bg-white/[0.2]" />
            </View>

            {/* Header */}
            <View className="flex-row justify-center items-center mb-10">
              <Text className="text-white text-[22px] font-extrabold tracking-tight">
                New Study Hall
              </Text>
            </View>

            {/* Step tracker */}
            <View className="flex-row items-center mb-14 justify-center">
              {STEP_META.map((meta, i) => {
                const s = i + 1;
                const isDone = s < step;
                const isActive = s === step;
                return (
                  <View key={meta.label} className="flex-row items-center">
                    <View className="items-center" style={{ width: 46 }}>
                      <View
                        className={`w-9 h-9 rounded-full items-center justify-center border ${
                          isDone
                            ? "bg-white border-white"
                            : isActive
                            ? "bg-white/[0.1] border-white"
                            : "bg-white/[0.04] border-white/[0.1]"
                        }`}
                      >
                        {isDone ? (
                          <Ionicons name="checkmark" size={16} color="#000" />
                        ) : (
                          <Ionicons
                            name={meta.icon}
                            size={15}
                            color={isActive ? "#fff" : "#52525B"}
                          />
                        )}
                      </View>
                      <Text
                        className={`text-[10px] font-bold mt-1.5 tracking-wide ${
                          isActive ? "text-white" : "text-[#52525B]"
                        }`}
                      >
                        {meta.label}
                      </Text>
                    </View>
                    {i < STEP_META.length - 1 && (
                      <View
                        className={`w-12 h-[2px] rounded-full mx-2 mb-4 ${
                          isDone ? "bg-white" : "bg-white/[0.08]"
                        }`}
                      />
                    )}
                  </View>
                );
              })}
            </View>

            {/* Content area based on step */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 4 }}
            >
              {step === 1 && (
                <View>
                  <Text className="text-white text-[17px] font-bold tracking-tight mb-2">
                    What should we call your study hall?
                  </Text>
                  <Text className="text-[#71717A] text-[13px] font-medium mb-10">
                    Pick a name that's easy to spot at a glance.
                  </Text>
                  <TextInput
                    className="bg-[#1A1A1C] border border-white/[0.07] rounded-[20px] text-white text-[16px] font-semibold"
                    style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}
                    placeholder="e.g. Gateway to Success"
                    placeholderTextColor="#52525B"
                    value={name}
                    onChangeText={setName}
                    maxLength={40}
                    autoCapitalize="words"
                    autoFocus
                  />
                  <Text className="text-[#52525B] text-[11px] font-bold text-right mt-2 mr-1">
                    {name.length}/40
                  </Text>
                </View>
              )}

              {step === 2 && (
                <View>
                  <Text className="text-white text-[17px] font-bold tracking-tight mb-2">
                    What is this study hall about?
                  </Text>
                  <Text className="text-[#71717A] text-[13px] font-medium mb-10">
                    A short blurb helps others know if it's for them.
                  </Text>
                  <TextInput
                    className="bg-[#1A1A1C] border border-white/[0.07] rounded-[20px] text-white text-[16px] font-semibold min-h-[104px]"
                    style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}
                    placeholder="Describe the goals or topics..."
                    placeholderTextColor="#52525B"
                    value={description}
                    onChangeText={setDescription}
                    maxLength={120}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    autoFocus
                  />
                  <Text className="text-[#52525B] text-[11px] font-bold text-right mt-2 mr-1">
                    {description.length}/120
                  </Text>
                </View>
              )}

              {step === 3 && (
                <View>
                  <Text className="text-white text-[17px] font-bold tracking-tight mb-2">
                    Choose a category
                  </Text>
                  <Text className="text-[#71717A] text-[13px] font-medium mb-10">
                    Helps people discover your study hall faster.
                  </Text>
                  <TextInput
                    className="bg-[#1A1A1C] border border-white/[0.07] rounded-[20px] text-white text-[16px] font-semibold"
                    style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}
                    placeholder="e.g. Design, Coding, Exams"
                    placeholderTextColor="#52525B"
                    value={category}
                    onChangeText={setCategory}
                    maxLength={24}
                    autoCapitalize="words"
                    autoFocus
                  />

                  {/* Existing categories as quick-pick suggestions */}
                  {existingCategories.length > 0 && (
                    <View className="flex-row flex-wrap gap-3 mt-6">
                      {existingCategories.map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => setCategory(cat)}
                          className={`px-4 py-2 rounded-full border ${
                            category === cat
                              ? "bg-white border-white"
                              : "bg-[#1A1A1C] border-white/[0.07]"
                          }`}
                          activeOpacity={0.7}
                        >
                          <Text
                            className={`text-[12.5px] font-bold tracking-tight ${
                              category === cat ? "text-black" : "text-[#A1A1AA]"
                            }`}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View className="flex-row items-center justify-between gap-4 pt-10 pb-12">
              {step > 1 ? (
                <TouchableOpacity
                  onPress={handleBack}
                  className="w-[52px] h-[52px] rounded-full bg-white/[0.06] items-center justify-center border border-white/[0.07]"
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={20} color="#E4E4E7" />
                </TouchableOpacity>
              ) : (
                <View className="w-[52px]" /> // Spacer for alignment
              )}

              {step < 3 ? (
                <TouchableOpacity
                  onPress={handleNext}
                  className={`flex-1 flex-row items-center justify-center gap-2 bg-white py-[15px] rounded-full ${
                    (step === 1 && !isNameValid) || (step === 2 && !isDescValid)
                      ? "opacity-30"
                      : ""
                  }`}
                  disabled={
                    (step === 1 && !isNameValid) || (step === 2 && !isDescValid)
                  }
                  activeOpacity={0.85}
                >
                  <Text className="text-black text-[15px] font-extrabold tracking-tight">
                    Next
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#000" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleCreate}
                  className={`flex-1 flex-row items-center justify-center gap-2 bg-white py-[15px] rounded-full ${
                    !isCatValid ? "opacity-30" : ""
                  }`}
                  disabled={!isCatValid || isLoading}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={18} color="#000" />
                      <Text className="text-black text-[15px] font-extrabold tracking-tight">
                        Finish
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}