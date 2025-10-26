export interface Agent {
  id: number;
  name: string;
  img: string;
  eliminated: boolean;
};

export interface PlayerSelect {
  userId: string,
  gaentId: string
}


export interface ChatType  {
  id: string;
  room_id: string;
  msg: string;
  answer: string|null;
  userId: string;
};