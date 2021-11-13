import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class <%= classify(name) %>HttpService {
    private readonly baseUrl = '<%= path %>';

    constructor(private http: HttpClient) {}

    public getAll(): Observable<<%= name %>[]> {
        return this.http.get<<%= name %>[]>(this.baseUrl);
    }

    public getById(id: number): Observable<<%= name %>> {
        return this.http.get<<%= name %>>(`${this.baseUrl}/${id}`);
    }
}

export interface <%= classify(name) %> {
    id: number;
    // other properties
}