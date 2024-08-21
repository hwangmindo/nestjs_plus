export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer',
  // 그냥 Admin, Customer 로 지정하면 0, 1이 되고
  // 위와같이 지정하면 db 저장값이 'Admin', 'Customer' 이렇게 되므로 식별하기 쉽다.
}
