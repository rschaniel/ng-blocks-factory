import { Observable } from 'rxjs';

export class CustomerHttpService {
    private readonly baseUrl = '';

    constructor(private http: HttpClient) {}

    public getAll(): Observable<Customer[]> {
        return this.http.get<Customer[]>(this.baseUrl);
    }

    public getById(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.baseUrl}/${id}`);
    }
}

export interface Customer {
    id: number;
    // other properties
}

interface HttpClient {
    get: <T>(url: string) => Observable<T>
}