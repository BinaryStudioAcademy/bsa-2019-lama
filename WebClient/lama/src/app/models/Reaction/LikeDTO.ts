import { Entity } from '../entity';

export interface LikeDTO
{
    id: number;
    photo: Entity;
    user: Entity;
}