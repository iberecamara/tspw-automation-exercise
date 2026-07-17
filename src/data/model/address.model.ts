export interface AddressType {
    title: string,
    birthDate: string,
    birthMonth: string,
    birthYear: string,
    firstname: string,
    lastname: string,
    company: string,
    addressOne: string,
    addressTwo: string,
    country: string,
    zipcode: string,
    state: string,
    city: string,
    mobileNumber?: string
}

export interface ResumedAddressType {
    name: string,
    addressOne: string,
    addressTwo: string,
    addressThree: string,
    cityStateZipcode: string,
    country: string,
    phone: string
}