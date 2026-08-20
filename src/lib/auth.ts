export const USERS_STORAGE_KEY = "nexus-dashboard-users";
export const SESSION_STORAGE_KEY = "nexus-dashboard-session";

export type RegisteredUser = {
  name: string;
  email: string;
  password: string;
};

export type PublicUser = {
  name: string;
  email: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function readUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Partial<RegisteredUser>[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (user): user is RegisteredUser =>
        Boolean(user.name?.trim() && user.email?.trim() && user.password),
    );
  } catch {
    return [];
  }
}

function writeUsers(users: RegisteredUser[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string) {
  const normalized = normalizeEmail(email);
  return readUsers().find((user) => normalizeEmail(user.email) === normalized) ?? null;
}

export function registerUser(input: RegisteredUser): {
  user?: PublicUser;
  error?: string;
} {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!name || !email || !password) {
    return { error: "Заполните имя, логин и пароль." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Укажите корректный логин (email)." };
  }

  if (password.length < 4) {
    return { error: "Пароль должен быть не короче 4 символов." };
  }

  if (findUserByEmail(email)) {
    return { error: "Пользователь с таким логином уже есть в базе." };
  }

  writeUsers([...readUsers(), { name, email, password }]);

  const saved = findUserByEmail(email);
  if (!saved) {
    return { error: "Пользователь не найден в базе." };
  }

  const publicUser = toPublicUser(saved);
  writeSession(publicUser);
  return { user: publicUser };
}

export function loginUser(login: string, password: string): {
  user?: PublicUser;
  error?: string;
} {
  const email = normalizeEmail(login);

  if (!email || !password) {
    return { error: "Введите логин и пароль." };
  }

  const saved = findUserByEmail(email);
  if (!saved || saved.password !== password) {
    return { error: "Неверный логин или пароль." };
  }

  const publicUser = toPublicUser(saved);
  writeSession(publicUser);
  return { user: publicUser };
}

export function readSession(): PublicUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PublicUser>;
    if (!parsed.name?.trim() || !parsed.email?.trim()) return null;

    const stored = findUserByEmail(parsed.email);
    if (!stored) return null;

    return toPublicUser(stored);
  } catch {
    return null;
  }
}

export function writeSession(user: PublicUser) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function toPublicUser(user: RegisteredUser): PublicUser {
  return { name: user.name, email: user.email };
}

export function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
