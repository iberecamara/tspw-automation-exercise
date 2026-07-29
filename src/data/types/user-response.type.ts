/**
 * Shape of a user entry as returned raw by `{@link Environment.GET_USER_BY_EMAIL_API_URL}` —
 * snake_case field names and a flat address, unlike the framework's own {@link UserType}/
 * {@link AddressType}, which {@link UserApi.getUser} maps into before returning.
 */
export interface UserResponseType {
  id?: number;
  name: string;
  email: string;
  password?: string;
  title: "Mr." | "Ms.";
  birth_day: string;
  birth_month: string;
  birth_year: string;
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber?: string;
}
