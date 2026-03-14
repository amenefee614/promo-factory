import { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  Platform as RNPlatform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GlassCard } from "@/components/glass-card";
import {
  TEMPLATE_LIBRARY,
  CATEGORY_INFO,
  getTemplatesByCategory,
  type TemplateCategory,
  type PromoTemplate,
} from "@/lib/template-library";
import * as Haptics from "expo-haptics";

interface TemplateBrowserModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PromoTemplate) => void;
}

export function TemplateBrowserModal({
  visible,
  onClose,
  onSelectTemplate,
}: TemplateBrowserModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");

  const categories: Array<TemplateCategory | "all"> = [
    "all",
    "restaurant",
    "fitness",
    "real_estate",
    "retail",
    "services",
    "seasonal",
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? TEMPLATE_LIBRARY
      : getTemplatesByCategory(selectedCategory);

  const handleSelectTemplate = (template: PromoTemplate) => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}>
        <LinearGradient
          colors={["rgba(99, 102, 241, 0.1)", "rgba(168, 85, 247, 0.1)"]}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 pt-16 px-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-1">
                <Text className="text-2xl font-bold" style={{ color: "#F8F9FF" }}>
                  Template Library
                </Text>
                <Text className="text-sm mt-1" style={{ color: "#A5B4FC" }}>
                  Choose a template to get started
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.6 : 1,
                  padding: 8,
                })}
              >
                <IconSymbol name="xmark" size={24} color="#F8F9FF" />
              </Pressable>
            </View>

            {/* Category Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
              contentContainerStyle={{ gap: 8 }}
            >
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                const info =
                  category === "all"
                    ? { name: "All", icon: "✨" }
                    : CATEGORY_INFO[category];

                return (
                  <Pressable
                    key={category}
                    onPress={() => {
                      if (RNPlatform.OS !== "web") {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      setSelectedCategory(category);
                    }}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <View
                      className="px-4 py-2 rounded-full flex-row items-center gap-2"
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(129, 140, 248, 0.3)"
                          : "rgba(255, 255, 255, 0.1)",
                        borderWidth: 1,
                        borderColor: isSelected
                          ? "rgba(129, 140, 248, 0.5)"
                          : "rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <Text className="text-base">{info.icon}</Text>
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: isSelected ? "#F8F9FF" : "#A5B4FC" }}
                      >
                        {info.name}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Template Grid */}
            <View className="gap-3 mb-6">
              {filteredTemplates.map((template) => (
                <Pressable
                  key={template.id}
                  onPress={() => handleSelectTemplate(template)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <GlassCard>
                    <View className="flex-row items-center p-4">
                      {/* Icon */}
                      <View
                        className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                        style={{
                          backgroundColor: template.colors.primary + "33",
                        }}
                      >
                        <Text className="text-3xl">{template.preview}</Text>
                      </View>

                      {/* Info */}
                      <View className="flex-1">
                        <Text
                          className="text-base font-bold mb-1"
                          style={{ color: "#F8F9FF" }}
                        >
                          {template.name}
                        </Text>
                        <Text
                          className="text-sm mb-2"
                          numberOfLines={2}
                          style={{ color: "#A5B4FC" }}
                        >
                          {template.description}
                        </Text>
                        <View className="flex-row gap-2">
                          {template.tags.slice(0, 3).map((tag) => (
                            <View
                              key={tag}
                              className="px-2 py-1 rounded"
                              style={{ backgroundColor: "rgba(129, 140, 248, 0.2)" }}
                            >
                              <Text
                                className="text-xs font-medium"
                                style={{ color: "#818CF8" }}
                              >
                                {tag}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* Arrow */}
                      <IconSymbol name="chevron.right" size={20} color="#818CF8" />
                    </View>
                  </GlassCard>
                </Pressable>
              ))}
            </View>

            {filteredTemplates.length === 0 && (
              <View className="items-center justify-center py-12">
                <Text className="text-lg" style={{ color: "#6B7280" }}>
                  No templates found
                </Text>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
}
