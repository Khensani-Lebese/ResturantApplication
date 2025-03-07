import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Linking,
  ImageBackground 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  const backgroundImage = 'https://res.cloudinary.com/dmdmv15pl/image/upload/v1741251194/splash_1_v93eis.png';

  const settingsSections = [
    {
      title: "Account & Security",
      items: [
        {
          title: "Security Settings",
          icon: "lock-closed-outline",
          onPress: () => router.push('/Security'),
          description: "Password, email, and account security"
        },
        {
          title: "Profile Information",
          icon: "person-outline",
          onPress: () => router.push('/Profile'),
          description: "Update your personal information"
        },
        {
          title: "Notifications",
          icon: "notifications-outline",
          onPress: () => router.push('/notifications'),
          description: "Manage your notification preferences"
        }
      ]
    },
    {
      title: "Support & Help",
      items: [
        {
          title: "Help Center",
          icon: "help-circle-outline",
          onPress: () => router.push('/Support'),
          description: "FAQs and support resources"
        },
        {
          title: "Contact Support",
          icon: "mail-outline",
          onPress: () => Linking.openURL('mailto:support@omakase.com'),
          description: "Get in touch with our support team"
        },
        {
          title: "Report an Issue",
          icon: "warning-outline",
          onPress: () => router.push('/Support'),
          description: "Report problems or submit feedback"
        }
      ]
    },
    {
      title: "About",
      items: [
        {
          title: "About Omakase",
          icon: "information-circle-outline",
          onPress: () => router.push('/About'),
          description: "Learn more about Omakase"
        },
        {
          title: "Terms of Service",
          icon: "document-text-outline",
          onPress: () => router.push('/Terms'),
          description: "Read our terms of service"
        },
        {
          title: "Privacy Policy",
          icon: "shield-checkmark-outline",
          onPress: () => router.push('/PrivacyPolicy'),
          description: "View our privacy policy"
        }
      ]
    }
  ];

  return (
    <ImageBackground source={{ uri: backgroundImage }} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Settings</Text>
          
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.settingItem}
                  onPress={item.onPress}
                >
                  <View style={styles.settingItemLeft}>
                    <Ionicons name={item.icon} size={24} color="#e4d4c6" style={styles.icon} />
                    <View style={styles.settingItemContent}>
                      <Text style={styles.settingItemTitle}>{item.title}</Text>
                      <Text style={styles.settingItemDescription}>{item.description}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#e4d4c6" />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 20,
    color: '#e4d4c6',
    marginTop: 20,
    letterSpacing: 2,
    textShadowColor: '#252228',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 0,
    textShadowColor: '#252228',
    textShadowOffset: { width: 1, height: -1 },
    textShadowRadius: 0,
    textShadowColor: '#252228',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 0,
    textShadowColor: '#252228',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#e4d4c6',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(228, 212, 198, 0.2)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e4d4c6',
    marginBottom: 4,
  },
  settingItemDescription: {
    fontSize: 14,
    color: 'rgba(228, 212, 198, 0.7)',
  },
}); 