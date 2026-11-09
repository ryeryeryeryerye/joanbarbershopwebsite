// Scaffold Service Layer
export class AuthService {
  async login(_email: string, _password: string) {
    // Scaffold placeholder - business logic will be implemented here
    return {
      token: 'scaffold_jwt_token',
      user: {
        id: 'user_placeholder_id',
        email: _email,
        name: 'Barber User',
        role: 'customer',
      },
    };
  }
}

export const authService = new AuthService();

