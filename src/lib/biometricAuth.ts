// Biometric authentication utilities
export const checkBiometricSupport = async (): Promise<boolean> => {
  if (!window.PublicKeyCredential) {
    return false;
  }

  try {
    // Check if biometric authentication is available
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (error) {
    console.log('Biometric check failed:', error);
    return false;
  }
};

export const authenticateWithBiometrics = async (): Promise<boolean> => {
  try {
    // Create a credential request for authentication
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credentialRequestOptions = {
      challenge,
      allowCredentials: [], // We don't have stored credentials yet
      userVerification: 'required' as UserVerificationRequirement,
      timeout: 60000, // 60 seconds
    };

    // For now, we'll use a simple fallback since we don't have credential storage
    // In a real app, you'd store and retrieve credentials
    const hasBiometric = await checkBiometricSupport();
    if (hasBiometric) {
      // Try to create a credential (this would normally be done during registration)
      // For demo purposes, we'll just return true if biometric is available
      return true;
    }

    return false;
  } catch (error) {
    console.log('Biometric authentication failed:', error);
    return false;
  }
};

export const authenticateWithPIN = async (pin: string): Promise<boolean> => {
  // Simple PIN authentication for demo
  // In a real app, you'd hash and compare against stored hash
  const storedPIN = localStorage.getItem('app_lock_pin');
  if (!storedPIN) {
    // First time - set the PIN
    localStorage.setItem('app_lock_pin', pin);
    return true;
  }
  return storedPIN === pin;
};

export const setupAppLock = async (): Promise<{ type: 'biometric' | 'pin', success: boolean }> => {
  const hasBiometric = await checkBiometricSupport();

  if (hasBiometric) {
    // Try biometric first
    const biometricSuccess = await authenticateWithBiometrics();
    if (biometricSuccess) {
      return { type: 'biometric', success: true };
    }
  }

  // Fallback to PIN
  const pin = prompt('Enter a 4-digit PIN for app lock:');
  if (pin && pin.length === 4 && /^\d{4}$/.test(pin)) {
    const pinSuccess = await authenticateWithPIN(pin);
    return { type: 'pin', success: pinSuccess };
  }

  return { type: 'pin', success: false };
};

export const unlockApp = async (): Promise<boolean> => {
  const lockType = localStorage.getItem('app_lock_type') as 'biometric' | 'pin';

  if (lockType === 'biometric') {
    return await authenticateWithBiometrics();
  } else if (lockType === 'pin') {
    const pin = prompt('Enter your PIN to unlock:');
    if (pin) {
      return await authenticateWithPIN(pin);
    }
  }

  return false;
};