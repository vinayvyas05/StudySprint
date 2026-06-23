import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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
} from "react-native";

type Props = {
  visible: boolean;
  existingCategories: string[];
  onClose: () => void;
  onCreate: (name: string, description: string, category: string) => Promise<void>;
  isLoading: boolean;
};

export default function CreateGroupModal({
  visible,
  existingCategories,
  onClose,
  onCreate,
  isLoading,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const isValid =
    name.trim().length >= 3 &&
    description.trim().length >= 5 &&
    category.trim().length >= 2;

  const handleCreate = async () => {
    if (!isValid || isLoading) return;

    await onCreate(name.trim(), description.trim(), category.trim());

    setName("");
    setDescription("");
    setCategory("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setCategory("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/70 justify-end">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="justify-end"
        >
          <View
            className="rounded-t-3xl px-6 pt-6 pb-9 border-t border-white/[0.06]"
            style={{ backgroundColor: "#0F1333", maxHeight: "85%" }}
          >
            {/* Header */}
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="text-slate-100 text-xl font-extrabold">
                  Create Study Hall
                </Text>
                <Text className="text-slate-500 text-[13px] mt-1 font-medium">
                  Bring focused learners together
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                className="w-9 h-9 rounded-xl bg-white/5 items-center justify-center"
                activeOpacity={0.6}
              >
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 20 }}
            >
              {/* Name Input */}
              <View>
                <Text className="text-slate-500 text-[10px] font-extrabold tracking-[1.5px] mb-2">
                  HALL NAME
                </Text>
                <TextInput
                  className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-slate-100 text-[15px] font-medium"
                  placeholder="e.g. GATE 2027 Warriors"
                  placeholderTextColor="#475569"
                  value={name}
                  onChangeText={setName}
                  maxLength={40}
                  autoCapitalize="words"
                />
                <Text className="text-slate-600 text-[10px] font-semibold text-right mt-1">
                  {name.length}/40
                </Text>
              </View>

              {/* Description Input */}
              <View>
                <Text className="text-slate-500 text-[10px] font-extrabold tracking-[1.5px] mb-2">
                  DESCRIPTION
                </Text>
                <TextInput
                  className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 pt-3.5 text-slate-100 text-[15px] font-medium min-h-[80px]"
                  placeholder="What's this hall about? Who should join?"
                  placeholderTextColor="#475569"
                  value={description}
                  onChangeText={setDescription}
                  maxLength={120}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
                <Text className="text-slate-600 text-[10px] font-semibold text-right mt-1">
                  {description.length}/120
                </Text>
              </View>

              {/* Category Input */}
              <View>
                <Text className="text-slate-500 text-[10px] font-extrabold tracking-[1.5px] mb-2">
                  CATEGORY
                </Text>
                <TextInput
                  className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-slate-100 text-[15px] font-medium"
                  placeholder="e.g. DSA, Exam Prep, Web Dev"
                  placeholderTextColor="#475569"
                  value={category}
                  onChangeText={setCategory}
                  maxLength={24}
                  autoCapitalize="words"
                />

                {/* Existing categories as quick-pick suggestions */}
                {existingCategories.length > 0 && (
                  <View className="flex-row flex-wrap gap-2 mt-3">
                    {existingCategories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg border ${
                          category === cat
                            ? "bg-indigo-500/15 border-indigo-500/30"
                            : "bg-white/[0.04] border-white/[0.06]"
                        }`}
                        activeOpacity={0.7}
                      >
                        <Text
                          className={`text-[12px] font-semibold ${
                            category === cat ? "text-indigo-300" : "text-slate-500"
                          }`}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Create Button */}
            <TouchableOpacity
              onPress={handleCreate}
              className={`flex-row items-center justify-center gap-2 bg-indigo-500 py-4 rounded-2xl mt-6 ${
                !isValid ? "opacity-40" : ""
              }`}
              disabled={!isValid || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="add-circle" size={18} color="#fff" />
                  <Text className="text-white text-[15px] font-bold">
                    Create Study Hall
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
