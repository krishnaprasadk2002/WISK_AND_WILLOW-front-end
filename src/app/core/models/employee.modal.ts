export interface Employee{
    _id?: string;
    employeeId?: string;
    name: string;
    email?: string;
    mobile: string;
    type:string
    is_employee?:  'Approved' | 'Pending' | 'Rejected';
    password?: string
}