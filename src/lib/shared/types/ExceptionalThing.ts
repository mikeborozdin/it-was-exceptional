interface ExceptionalThing {
  id: string;
  googlePlaceId: string;
  name: string;
  whatExceptionalAboutIt: string;
  address: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  user: {
    id: string;
    name: string;
  };
  website?: string;
}

export { type ExceptionalThing };
