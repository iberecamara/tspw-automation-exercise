/** A user's full address/personal details, as submitted to account creation/update forms. */
export interface AddressType {
  title: string;
  birthDate: string;
  birthMonth: string;
  birthYear: string;
  firstname: string;
  lastname: string;
  company: string;
  addressOne: string;
  addressTwo: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  /** Optional since not every flow that constructs an address needs a mobile number (though the account-creation API requires one). */
  mobileNumber?: string;
}

/** A condensed, single-block address as displayed/echoed back by the UI (e.g. on the checkout page's address summary), rather than the individually-fielded form shape of {@link AddressType}. */
export interface ResumedAddressType {
  name: string;
  addressOne: string;
  addressTwo: string;
  addressThree: string;
  /** City, state, and zipcode combined into a single display string. */
  cityStateZipcode: string;
  country: string;
  phone: string;
}
