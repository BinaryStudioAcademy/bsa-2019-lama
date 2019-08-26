export interface GetUserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;

  avatarId?: number;
  avatar?: string;
}
