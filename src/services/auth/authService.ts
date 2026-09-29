// =============================================================================
// BUILTIT AI - Auth Service Interface + Mock Implementation
// =============================================================================

import { User, AuthSession, UserSettings, UserSubscription } from '@/types';
import { LoginInput, SignupInput } from '@/lib/validation';
import { AppError, ErrorCodes } from '@/lib/errors';
import { authLogger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

// ---------------------------------------------------------------------------
// Auth Service Interface
// ---------------------------------------------------------------------------

export interface IAuthService {
  login(credentials: LoginInput): Promise<AuthSession>;
  signup(credentials: SignupInput): Promise<AuthSession>;
  logout(accessToken: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthSession>;
  getSession(accessToken: string): Promise<AuthSession | null>;
  getCurrentUser(accessToken: string): Promise<User | null>;
  deleteAccount(userId: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Mock Auth Service
// ---------------------------------------------------------------------------

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'en',
  voiceEnabled: false,
  voiceLanguage: 'en-US',
  autoSave: true,
  defaultExportFormat: 'png',
  notificationsEnabled: true,
};

const DEFAULT_SUBSCRIPTION: UserSubscription = {
  plan: 'free',
  status: 'active',
  uploadsUsed: 0,
  uploadsLimit: 10,
};

// In-memory store for mock
const mockUsers: Map<string, User & { passwordHash: string }> = new Map();
const mockSessions: Map<string, { session: AuthSession; userId: string }> = new Map();

function createMockUser(name: string, email: string): User {
  return {
    id: uuidv4(),
    email,
    name,
    provider: 'email',
    createdAt: new Date(),
    updatedAt: new Date(),
    settings: { ...DEFAULT_SETTINGS },
    subscription: { ...DEFAULT_SUBSCRIPTION },
  };
}

function createMockSession(user: User): AuthSession {
  return {
    user,
    accessToken: `mock-access-${uuidv4()}`,
    refreshToken: `mock-refresh-${uuidv4()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
}

export class MockAuthService implements IAuthService {
  constructor() {
    // Seed a demo user
    const demoUser = createMockUser('Demo User', 'demo@builtitai.com');
    mockUsers.set(demoUser.email, { ...demoUser, passwordHash: 'demo1234' });
    authLogger.info('Mock Auth: Seeded demo user', { email: 'demo@builtitai.com' });
  }

  async login(credentials: LoginInput): Promise<AuthSession> {
    authLogger.info('MockAuth: Login attempt', { email: credentials.email });
    await new Promise((r) => setTimeout(r, 500));

    const userData = mockUsers.get(credentials.email);
    if (!userData || userData.passwordHash !== credentials.password) {
      throw new AppError('Invalid email or password', ErrorCodes.AUTH_INVALID_CREDENTIALS, 401);
    }

    const { passwordHash: _, ...user } = userData;
    const session = createMockSession(user);
    mockSessions.set(session.accessToken, { session, userId: user.id });

    authLogger.info('MockAuth: Login success', { userId: user.id });
    return session;
  }

  async signup(credentials: SignupInput): Promise<AuthSession> {
    authLogger.info('MockAuth: Signup attempt', { email: credentials.email });
    await new Promise((r) => setTimeout(r, 500));

    if (mockUsers.has(credentials.email)) {
      throw new AppError('Email already registered', ErrorCodes.AUTH_EMAIL_EXISTS, 409);
    }

    const user = createMockUser(credentials.name, credentials.email);
    mockUsers.set(credentials.email, { ...user, passwordHash: credentials.password });

    const session = createMockSession(user);
    mockSessions.set(session.accessToken, { session, userId: user.id });

    authLogger.info('MockAuth: Signup success', { userId: user.id });
    return session;
  }

  async logout(accessToken: string): Promise<void> {
    authLogger.info('MockAuth: Logout');
    mockSessions.delete(accessToken);
  }

  async refreshToken(refreshToken: string): Promise<AuthSession> {
    const entry = Array.from(mockSessions.values()).find(
      (s) => s.session.refreshToken === refreshToken
    );
    if (!entry) {
      throw new AppError('Invalid refresh token', ErrorCodes.AUTH_TOKEN_INVALID, 401);
    }

    const userData = Array.from(mockUsers.values()).find((u) => u.id === entry.userId);
    if (!userData) {
      throw new AppError('User not found', ErrorCodes.NOT_FOUND, 404);
    }

    const { passwordHash: _, ...user } = userData;
    mockSessions.delete(entry.session.accessToken);
    const newSession = createMockSession(user);
    mockSessions.set(newSession.accessToken, { session: newSession, userId: user.id });

    return newSession;
  }

  async getSession(accessToken: string): Promise<AuthSession | null> {
    const entry = mockSessions.get(accessToken);
    if (!entry) return null;
    if (entry.session.expiresAt < new Date()) {
      mockSessions.delete(accessToken);
      return null;
    }
    return entry.session;
  }

  async getCurrentUser(accessToken: string): Promise<User | null> {
    const session = await this.getSession(accessToken);
    return session?.user ?? null;
  }

  async deleteAccount(userId: string): Promise<void> {
    authLogger.info('MockAuth: Delete account', { userId });
    const email = Array.from(mockUsers.values()).find((u) => u.id === userId)?.email;
    if (email) mockUsers.delete(email);
    for (const [token, entry] of mockSessions.entries()) {
      if (entry.userId === userId) mockSessions.delete(token);
    }
  }
}

// ---------------------------------------------------------------------------
// Auth Service Factory
// ---------------------------------------------------------------------------

let _authServiceInstance: IAuthService | null = null;

export function getAuthService(): IAuthService {
  if (_authServiceInstance) return _authServiceInstance;
  _authServiceInstance = new MockAuthService();
  return _authServiceInstance;
}
