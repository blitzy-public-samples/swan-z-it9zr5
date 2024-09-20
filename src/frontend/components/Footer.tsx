import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { SOCIAL_MEDIA_LINKS, APP_VERSION } from 'src/shared/constants';
import { getCommonStyles } from 'src/frontend/utils/styleHelpers';

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  const navigation = useNavigation();
  const commonStyles = getCommonStyles();

  const handleNavigation = (screenName: string) => {
    navigation.navigate(screenName);
  };

  const handleSocialMediaLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.footer}>
      <Text style={styles.copyright}>
        © {currentYear} Swan-Z Style. All rights reserved.
      </Text>
      
      <View style={styles.socialLinks}>
        {SOCIAL_MEDIA_LINKS.map((link, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSocialMediaLink(link.url)}
            style={styles.socialIcon}
          >
            <Icon name={link.icon} size={20} color={commonStyles.colors.primary} />
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.navLinks}>
        <TouchableOpacity onPress={() => handleNavigation('About')}>
          <Text style={styles.navLink}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('PrivacyPolicy')}>
          <Text style={styles.navLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('TermsOfService')}>
          <Text style={styles.navLink}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.version}>Version {APP_VERSION}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  copyright: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 12,
    color: '#666',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  navLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  navLink: {
    marginHorizontal: 10,
    color: '#007AFF',
    fontSize: 14,
  },
  version: {
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
  },
});

export default Footer;