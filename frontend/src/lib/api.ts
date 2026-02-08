import { getToken, getUser, removeToken, removeUser } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7860";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: "todo" | "in-progress" | "completed";
}

// Chat types
export interface ChatResponseBody {
  type: string;
  content: string;
  meta?: Record<string, unknown>;
}

export interface ChatResponse {
  status: string;
  conversation_id: number;
  response: ChatResponseBody;
}

export interface ConversationSummary {
  id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  tool_calls_json: string | null;
  created_at: string;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Backend returns snake_case with completed boolean; frontend uses camelCase with status string
interface BackendTask {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

function mapBackendTask(bt: BackendTask): Task {
  return {
    id: String(bt.id),
    title: bt.title,
    description: bt.description,
    status: bt.completed ? "completed" : "todo",
    createdAt: bt.created_at,
    updatedAt: bt.updated_at,
    userId: bt.user_id,
  };
}

function getUserId(): string {
  const user = getUser();
  if (!user?.id) {
    throw new ApiError(401, "User not authenticated");
  }
  return user.id;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeToken();
    removeUser();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError(401, "Authentication required");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      body.detail || body.error || `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  getTasks: async (): Promise<{ tasks: Task[] }> => {
    const userId = getUserId();
    const backendTasks = await request<BackendTask[]>(
      `/api/${userId}/tasks`,
    );
    return { tasks: backendTasks.map(mapBackendTask) };
  },

  getTask: async (id: string): Promise<{ task: Task }> => {
    const userId = getUserId();
    const bt = await request<BackendTask>(`/api/${userId}/tasks/${id}`);
    return { task: mapBackendTask(bt) };
  },

  createTask: async (data: CreateTaskPayload): Promise<{ task: Task }> => {
    const userId = getUserId();
    const bt = await request<BackendTask>(`/api/${userId}/tasks`, {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        description: data.description || null,
      }),
    });
    return { task: mapBackendTask(bt) };
  },

  updateTask: async (
    id: string,
    data: UpdateTaskPayload,
  ): Promise<{ task: Task }> => {
    const userId = getUserId();
    // Map frontend status to backend completed boolean
    const backendData: Record<string, unknown> = {};
    if (data.title !== undefined) backendData.title = data.title;
    if (data.description !== undefined) backendData.description = data.description;
    if (data.status !== undefined) {
      backendData.completed = data.status === "completed";
    }
    const bt = await request<BackendTask>(`/api/${userId}/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    });
    return { task: mapBackendTask(bt) };
  },

  deleteTask: async (id: string): Promise<{ success: boolean }> => {
    const userId = getUserId();
    return request<{ success: boolean }>(`/api/${userId}/tasks/${id}`, {
      method: "DELETE",
    });
  },

  toggleTask: async (id: string): Promise<{ task: Task }> => {
    const userId = getUserId();
    const bt = await request<BackendTask>(
      `/api/${userId}/tasks/${id}/complete`,
      { method: "PATCH" },
    );
    return { task: mapBackendTask(bt) };
  },

  getTaskStats: async (): Promise<TaskStats> => {
    const userId = getUserId();
    const backendTasks = await request<BackendTask[]>(
      `/api/${userId}/tasks`,
    );
    const total = backendTasks.length;
    const completed = backendTasks.filter((t) => t.completed).length;
    return { total, completed, pending: total - completed };
  },

  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: import("./auth").User }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),

  signup: (data: { email: string; password: string; name?: string }) =>
    request<{ token: string; user: import("./auth").User }>(
      "/api/auth/signup",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),

  // Chat API
  sendMessage: async (
    message: string,
    conversationId?: number,
  ): Promise<ChatResponse> => {
    const userId = getUserId();
    return request<ChatResponse>(`/api/${userId}/chat`, {
      method: "POST",
      body: JSON.stringify({
        message,
        conversation_id: conversationId ?? null,
      }),
    });
  },

  getConversations: async (): Promise<ConversationSummary[]> => {
    const userId = getUserId();
    return request<ConversationSummary[]>(`/api/${userId}/conversations`);
  },

  getMessages: async (conversationId: number): Promise<ChatMessage[]> => {
    const userId = getUserId();
    return request<ChatMessage[]>(
      `/api/${userId}/conversations/${conversationId}/messages`,
    );
  },
};

export { ApiError };
