export interface SocketIOMessageCreateResponseInterface {
  success: boolean;
  message: string;
  data: SocketIOMessageCreateResponse;
}

export interface SocketIOMessageCreateResponse {
  id: string;
  message_replied_id?: string;
  conversation_id: string;
  from: string;
  message: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO';
  status: 'PENDING' | 'DELIVERED' | 'READ';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  deleted_by?: Date;
}
