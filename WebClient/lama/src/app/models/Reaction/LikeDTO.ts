import { Entity } from '../entity';

export interface LikeDTO {
    id: number;
    photoId: number;
    userId: number;
    photo: Entity;
    user: Entity;
}
