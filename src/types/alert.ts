
export interface SuperAdminAlert {
  _id: string;
  title: string;
  message: string;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SuperAdminAlertPaginationInterface {
  page: number;
  data: SuperAdminAlert[];
  totalPages: number;
}

export interface AlertResponse {
  data: SuperAdminAlert[];
  total: number;
  page: number;
  totalPages: number;
}
