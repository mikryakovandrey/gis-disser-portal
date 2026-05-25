"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { fields as seedFields } from "@/data/fields";
import type {
  DemoDatabase,
  DemoUser,
  Field,
  FieldOverride,
  PublicDemoUser,
  UserRole
} from "@/types";

const DEMO_DB_KEY = "agrosphere-demo-db";
const DEMO_SESSION_KEY = "agrosphere-demo-session";

const seedUsers: DemoUser[] = [
  {
    id: "user-admin-1",
    name: "System Admin",
    email: "admin@agrosphere.demo",
    password: "admin123",
    role: "admin",
    createdAt: "2026-05-25"
  },
  {
    id: "user-demo-1",
    name: "Demo User",
    email: "user@agrosphere.demo",
    password: "user123",
    role: "user",
    createdAt: "2026-05-25"
  }
];

const seedDatabase: DemoDatabase = {
  users: seedUsers,
  fieldOverrides: []
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type DemoPlatformContextValue = {
  isReady: boolean;
  currentUser: PublicDemoUser | null;
  users: PublicDemoUser[];
  fields: Field[];
  fieldOverrides: FieldOverride[];
  login: (email: string, password: string) => { ok: boolean; message: string };
  register: (payload: RegisterPayload) => { ok: boolean; message: string };
  logout: () => void;
  setUserRole: (userId: string, role: UserRole) => void;
  deleteUser: (userId: string) => void;
  upsertFieldOverride: (override: FieldOverride) => void;
  clearFieldOverride: (fieldId: string) => void;
};

const DemoPlatformContext = createContext<DemoPlatformContextValue | null>(null);

export function DemoPlatformProvider({ children }: { children: ReactNode }) {
  const [database, setDatabase] = useState<DemoDatabase>(seedDatabase);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedDb = window.localStorage.getItem(DEMO_DB_KEY);
    const storedSession = window.localStorage.getItem(DEMO_SESSION_KEY);

    if (storedDb) {
      try {
        const parsed = JSON.parse(storedDb) as DemoDatabase;
        setDatabase({
          users:
            parsed.users?.length > 0
              ? parsed.users
              : seedDatabase.users,
          fieldOverrides: parsed.fieldOverrides ?? []
        });
      } catch {
        setDatabase(seedDatabase);
      }
    } else {
      window.localStorage.setItem(DEMO_DB_KEY, JSON.stringify(seedDatabase));
    }

    if (storedSession) {
      setSessionUserId(storedSession);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(DEMO_DB_KEY, JSON.stringify(database));
  }, [database, isReady]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (sessionUserId) {
      window.localStorage.setItem(DEMO_SESSION_KEY, sessionUserId);
    } else {
      window.localStorage.removeItem(DEMO_SESSION_KEY);
    }
  }, [sessionUserId, isReady]);

  const currentUser = useMemo(() => {
    const found = database.users.find((user) => user.id === sessionUserId);
    return found ? toPublicUser(found) : null;
  }, [database.users, sessionUserId]);

  const fields = useMemo(
    () =>
      seedFields.map((field) => {
        const override = database.fieldOverrides.find(
          (item) => item.fieldId === field.id
        );

        if (!override) {
          return field;
        }

        return {
          ...field,
          status: override.status ?? field.status,
          recommendation: override.recommendation ?? field.recommendation,
          irrigationMode: override.irrigationMode ?? field.irrigationMode,
          irrigationWindow: override.irrigationWindow ?? field.irrigationWindow,
          riskIndex: override.riskIndex ?? field.riskIndex,
          yieldForecast: override.yieldForecast ?? field.yieldForecast,
          soilMoisture: override.soilMoisture ?? field.soilMoisture,
          airTemperature: override.airTemperature ?? field.airTemperature,
          airHumidity: override.airHumidity ?? field.airHumidity,
          soilPh: override.soilPh ?? field.soilPh,
          precipitation: override.precipitation ?? field.precipitation,
          nutrients: override.nutrients ?? field.nutrients,
          updatedAt: override.updatedAt ?? field.updatedAt
        };
      }),
    [database.fieldOverrides]
  );

  const login = useCallback(
    (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const user = database.users.find(
        (item) =>
          item.email.trim().toLowerCase() === normalizedEmail &&
          item.password === password
      );

      if (!user) {
        return {
          ok: false,
          message: "Incorrect email or password."
        };
      }

      setSessionUserId(user.id);

      return {
        ok: true,
        message: "Login successful."
      };
    },
    [database.users]
  );

  const register = useCallback(
    ({ name, email, password }: RegisterPayload) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (database.users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
        return {
          ok: false,
          message: "A user with this email already exists."
        };
      }

      const newUser: DemoUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: "user",
        createdAt: new Date().toISOString().slice(0, 10)
      };

      setDatabase((current) => ({
        ...current,
        users: [...current.users, newUser]
      }));
      setSessionUserId(newUser.id);

      return {
        ok: true,
        message: "Registration complete."
      };
    },
    [database.users]
  );

  const logout = useCallback(() => {
    setSessionUserId(null);
  }, []);

  const setUserRole = useCallback((userId: string, role: UserRole) => {
    setDatabase((current) => ({
      ...current,
      users: current.users.map((user) =>
        user.id === userId ? { ...user, role } : user
      )
    }));
  }, []);

  const deleteUser = useCallback(
    (userId: string) => {
      setDatabase((current) => ({
        ...current,
        users: current.users.filter((user) => user.id !== userId)
      }));

      if (sessionUserId === userId) {
        setSessionUserId(null);
      }
    },
    [sessionUserId]
  );

  const upsertFieldOverride = useCallback(
    (override: FieldOverride) => {
      setDatabase((current) => {
        const nextOverrides = [...current.fieldOverrides];
        const existingIndex = nextOverrides.findIndex(
          (item) => item.fieldId === override.fieldId
        );

        const payload: FieldOverride = {
          ...override,
          updatedAt: new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
          }),
          lastEditedBy: currentUser?.email ?? "guest"
        };

        if (existingIndex >= 0) {
          nextOverrides[existingIndex] = {
            ...nextOverrides[existingIndex],
            ...payload
          };
        } else {
          nextOverrides.push(payload);
        }

        return {
          ...current,
          fieldOverrides: nextOverrides
        };
      });
    },
    [currentUser?.email]
  );

  const clearFieldOverride = useCallback((fieldId: string) => {
    setDatabase((current) => ({
      ...current,
      fieldOverrides: current.fieldOverrides.filter(
        (item) => item.fieldId !== fieldId
      )
    }));
  }, []);

  const value = useMemo<DemoPlatformContextValue>(
    () => ({
      isReady,
      currentUser,
      users: database.users.map(toPublicUser),
      fields,
      fieldOverrides: database.fieldOverrides,
      login,
      register,
      logout,
      setUserRole,
      deleteUser,
      upsertFieldOverride,
      clearFieldOverride
    }),
    [
      clearFieldOverride,
      currentUser,
      database.fieldOverrides,
      database.users,
      fields,
      isReady,
      login,
      logout,
      register,
      setUserRole,
      deleteUser,
      upsertFieldOverride
    ]
  );

  return (
    <DemoPlatformContext.Provider value={value}>
      {children}
    </DemoPlatformContext.Provider>
  );
}

export function useDemoPlatform() {
  const context = useContext(DemoPlatformContext);

  if (!context) {
    throw new Error("useDemoPlatform must be used inside DemoPlatformProvider.");
  }

  return context;
}

function toPublicUser(user: DemoUser): PublicDemoUser {
  const { password, ...publicUser } = user;
  return publicUser;
}
