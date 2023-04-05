export interface SocketIOMessageCreateResponseInterface {
  success: boolean;
  message: string;
  data: SocketIOMessageCreateResponse;
}

export interface SocketIOMessageCreateResponse {
  id: string;
  group_id: string;
  from: string;
  message: string;
  type: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  deleted_by?: string;
}
