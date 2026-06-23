export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface CreateGroupPayload {
  name: string;
  description: string;
  category: string;
  createdBy: string;
}

export interface GroupMembership {
  id: string;
  userId: string;
  groupId: string;
  joinedAt?: any;
}