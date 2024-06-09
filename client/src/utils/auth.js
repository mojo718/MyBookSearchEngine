import decode from 'jwt-decode';

class AuthService {
  // Retrieve the user's profile information from the token
  getProfile() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }
      return decode(token);
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
  }

  // Check if the user is logged in by verifying the presence and validity of the token
  loggedIn() {
    const token = this.getToken();
    // Return true if the token exists and is not expired
    return !!token && !this.isTokenExpired(token);
  }

  // Check if the token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      // Check if the token's expiration time is less than the current time
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false; // Token is invalid
    }
  }

  // Retrieve the token from local storage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Set the token in local storage and redirect to the homepage
  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/'); 
  }

  // Remove the token from local storage and redirect to the homepage
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/'); 
  }
}

export default new AuthService();
