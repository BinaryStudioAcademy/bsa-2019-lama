import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommentListDto, CreateCommentDTO } from '../models';

@Injectable()
export class CommentService {
    // fields
    private httpClient: HttpClient;

    // constructors
    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    // methods
    public getComments(photoId: number): Observable<CommentListDto[]> {
        return this.httpClient.get<CommentListDto[]>(`${environment.lamaApiUrl}/api/comments/${photoId}`);
    }

    public create(createCommentDTO: CreateCommentDTO): Observable<number> {
        // return commentId
        return this.httpClient.post<number>(`${environment.lamaApiUrl}/api/comments/`, createCommentDTO);
    }

    public delete(commentId: number): Observable<any> {
        return this.httpClient.delete(`${environment.lamaApiUrl}/api/comments/${commentId}`);
    }
}
