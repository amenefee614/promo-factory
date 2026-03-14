import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function LandingPage() {
  const APP_URL = 'https://8081-i574die8ukqw0x17b6e3c-f4bd1687.us2.manus.computer';

  const handleTryNow = () => {
    router.push('/(tabs)');
  };

  const handleOpenExternal = () => {
    Linking.openURL(APP_URL);
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#6B46C1', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-16 pb-20 px-6"
        >
          <View className="max-w-4xl mx-auto">
            <Text className="text-5xl font-bold text-white text-center mb-4">
              Promo Factory Ultimate
            </Text>
            <Text className="text-2xl text-white/90 text-center mb-8">
              AI-Powered Marketing in 60 Seconds
            </Text>
            <Text className="text-lg text-white/80 text-center mb-10 leading-relaxed">
              Create professional social media posts, flyers, and video ads instantly.
              No design skills needed. 100% FREE during soft launch.
            </Text>
            
            <View className="flex-row justify-center gap-4 flex-wrap">
              <TouchableOpacity
                onPress={handleTryNow}
                className="bg-yellow-400 px-8 py-4 rounded-full active:opacity-80"
              >
                <Text className="text-purple-900 font-bold text-lg">
                  Try It Now - FREE
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleOpenExternal}
                className="bg-white/20 px-8 py-4 rounded-full active:opacity-80 border-2 border-white/40"
              >
                <Text className="text-white font-bold text-lg">
                  Open in Browser
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Challenge Section */}
        <View className="bg-slate-900 py-16 px-6">
          <View className="max-w-4xl mx-auto">
            <Text className="text-4xl font-bold text-white text-center mb-6">
              🚨 Can You Break My App? 🚨
            </Text>
            <Text className="text-xl text-white/80 text-center mb-8 leading-relaxed">
              I need YOUR help to make this the best tool for small businesses.
              Test it hard. Find the bugs. Tell me what sucks. Tell me what's brilliant.
            </Text>
            
            <View className="bg-white/10 rounded-2xl p-6 mb-8">
              <Text className="text-lg text-white font-semibold mb-4">Your Mission:</Text>
              <View className="gap-3">
                <Text className="text-white/90 text-base">✅ Try to break it</Text>
                <Text className="text-white/90 text-base">✅ Push every button</Text>
                <Text className="text-white/90 text-base">✅ Generate as many promos as you can</Text>
                <Text className="text-white/90 text-base">✅ Tell me what needs fixing</Text>
                <Text className="text-white/90 text-base">✅ Share what works great</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleTryNow}
              className="bg-red-500 px-8 py-4 rounded-full active:opacity-80 self-center"
            >
              <Text className="text-white font-bold text-lg">
                Accept Challenge →
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View className="bg-background py-16 px-6">
          <View className="max-w-4xl mx-auto">
            <Text className="text-4xl font-bold text-foreground text-center mb-4">
              What You Get
            </Text>
            <Text className="text-lg text-muted text-center mb-12">
              Everything you need to create professional marketing content
            </Text>

            <View className="gap-6">
              {/* Feature 1 */}
              <View className="bg-surface rounded-2xl p-6 border border-border">
                <Text className="text-2xl font-bold text-foreground mb-3">
                  🎨 AI Content Generation
                </Text>
                <Text className="text-base text-muted leading-relaxed">
                  Generate complete marketing bundles with images, videos, and copy in seconds.
                  Powered by cutting-edge AI models.
                </Text>
              </View>

              {/* Feature 2 */}
              <View className="bg-surface rounded-2xl p-6 border border-border">
                <Text className="text-2xl font-bold text-foreground mb-3">
                  📱 Multi-Platform Export
                </Text>
                <Text className="text-base text-muted leading-relaxed">
                  Automatic resizing for Instagram, Facebook, TikTok, LinkedIn, and Twitter.
                  One click, all platforms.
                </Text>
              </View>

              {/* Feature 3 */}
              <View className="bg-surface rounded-2xl p-6 border border-border">
                <Text className="text-2xl font-bold text-foreground mb-3">
                  🎯 21 Professional Templates
                </Text>
                <Text className="text-base text-muted leading-relaxed">
                  Industry-specific templates for restaurants, fitness, retail, real estate,
                  services, and events.
                </Text>
              </View>

              {/* Feature 4 */}
              <View className="bg-surface rounded-2xl p-6 border border-border">
                <Text className="text-2xl font-bold text-foreground mb-3">
                  📹 Video Ad Creation
                </Text>
                <Text className="text-base text-muted leading-relaxed">
                  Generate professional video ads with Google Veo AI. Pro and Agency tiers only.
                </Text>
              </View>

              {/* Feature 5 */}
              <View className="bg-surface rounded-2xl p-6 border border-border">
                <Text className="text-2xl font-bold text-foreground mb-3">
                  📊 Analytics Dashboard
                </Text>
                <Text className="text-base text-muted leading-relaxed">
                  Track your content performance, engagement rates, and ROI across all platforms.
                </Text>
              </View>

              {/* Feature 6 */}
              <View className="bg-surface rounded-2xl p-6 border border-border">
                <Text className="text-2xl font-bold text-foreground mb-3">
                  📅 Content Calendar
                </Text>
                <Text className="text-base text-muted leading-relaxed">
                  Schedule and organize your marketing campaigns with our built-in calendar system.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View className="bg-purple-900 py-16 px-6">
          <View className="max-w-4xl mx-auto">
            <View className="flex-row flex-wrap justify-center gap-8">
              <View className="items-center">
                <Text className="text-5xl font-bold text-yellow-400 mb-2">21</Text>
                <Text className="text-white/80 text-lg">Templates</Text>
              </View>
              <View className="items-center">
                <Text className="text-5xl font-bold text-yellow-400 mb-2">6</Text>
                <Text className="text-white/80 text-lg">Industries</Text>
              </View>
              <View className="items-center">
                <Text className="text-5xl font-bold text-yellow-400 mb-2">∞</Text>
                <Text className="text-white/80 text-lg">Generations</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Who This Is For Section */}
        <View className="bg-background py-16 px-6">
          <View className="max-w-4xl mx-auto">
            <Text className="text-4xl font-bold text-foreground text-center mb-12">
              Perfect For
            </Text>

            <View className="gap-4">
              <View className="flex-row items-center gap-4 bg-surface rounded-xl p-4 border border-border">
                <Text className="text-3xl">🍔</Text>
                <Text className="text-lg text-foreground font-semibold flex-1">
                  Restaurant Owners
                </Text>
              </View>
              <View className="flex-row items-center gap-4 bg-surface rounded-xl p-4 border border-border">
                <Text className="text-3xl">💪</Text>
                <Text className="text-lg text-foreground font-semibold flex-1">
                  Fitness Trainers
                </Text>
              </View>
              <View className="flex-row items-center gap-4 bg-surface rounded-xl p-4 border border-border">
                <Text className="text-3xl">🏠</Text>
                <Text className="text-lg text-foreground font-semibold flex-1">
                  Real Estate Agents
                </Text>
              </View>
              <View className="flex-row items-center gap-4 bg-surface rounded-xl p-4 border border-border">
                <Text className="text-3xl">🛍️</Text>
                <Text className="text-lg text-foreground font-semibold flex-1">
                  Retail Shops
                </Text>
              </View>
              <View className="flex-row items-center gap-4 bg-surface rounded-xl p-4 border border-border">
                <Text className="text-3xl">⚙️</Text>
                <Text className="text-lg text-foreground font-semibold flex-1">
                  Service Businesses
                </Text>
              </View>
              <View className="flex-row items-center gap-4 bg-surface rounded-xl p-4 border border-border">
                <Text className="text-3xl">🎉</Text>
                <Text className="text-lg text-foreground font-semibold flex-1">
                  Event Organizers
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Final CTA Section */}
        <LinearGradient
          colors={['#3B82F6', '#6B46C1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="py-20 px-6"
        >
          <View className="max-w-4xl mx-auto items-center">
            <Text className="text-4xl font-bold text-white text-center mb-6">
              Ready to Build Something Amazing?
            </Text>
            <Text className="text-xl text-white/80 text-center mb-10 leading-relaxed">
              Join the soft launch. Test it for free. Help shape the future of marketing tools
              for small businesses.
            </Text>
            
            <TouchableOpacity
              onPress={handleTryNow}
              className="bg-yellow-400 px-10 py-5 rounded-full active:opacity-80"
            >
              <Text className="text-purple-900 font-bold text-xl">
                Start Creating Now →
              </Text>
            </TouchableOpacity>

            <Text className="text-white/60 text-sm text-center mt-8">
              No credit card required • No trial period • 100% FREE during soft launch
            </Text>
          </View>
        </LinearGradient>

        {/* Footer */}
        <View className="bg-slate-900 py-8 px-6">
          <View className="max-w-4xl mx-auto">
            <Text className="text-white/60 text-center text-sm">
              © 2026 Promo Factory Ultimate • Built for Small Businesses
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
