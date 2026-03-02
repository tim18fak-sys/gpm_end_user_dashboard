
export interface SuperAdminNotification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | string;
  readBy: string[];
  isGlobal: boolean;
  profile_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  data: SuperAdminNotification[];
  total: number;
  page: number;
  totalPages: number;
}
