export interface IRegistration {
    email: string,
    image?: File,
    name: string,
    lastName: string,
    phone: string,
    password: string,
    password_confirmation: string,
}

export interface IRegistrationResult {
    access_token: string
}