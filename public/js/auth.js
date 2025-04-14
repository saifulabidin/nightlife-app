class Auth {
  static async login(username, password) {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) throw new Error('Login failed');
      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async register(username, email, password) {
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const response = await fetch('/auth/user', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to get user');
      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async logout() {
    try {
      const response = await fetch('/auth/logout', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Logout failed');
      return await response.json();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  static async attendBar(barId) {
    try {
      const response = await fetch(`/api/bars/${barId}/attend`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to attend bar');
      return await response.json();
    } catch (error) {
      console.error('Error attending bar:', error);
      throw error;
    }
  }

  static async unattendBar(barId) {
    try {
      const response = await fetch(`/api/bars/${barId}/attend`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to unattend bar');
      return await response.json();
    } catch (error) {
      console.error('Error unattending bar:', error);
      throw error;
    }
  }

  static async getBarAttendees(barId) {
    try {
      const response = await fetch(`/api/bars/${barId}/attendees`);
      if (!response.ok) throw new Error('Failed to get bar attendees');
      return await response.json();
    } catch (error) {
      console.error('Error getting bar attendees:', error);
      return [];
    }
  }

  static async isUserGoing(barId) {
    const user = await this.getCurrentUser();
    if (!user || !user.bars) return false;
    return user.bars.some(b => b.barId === barId && b.going);
  }
}

window.Auth = Auth;
