declare module '@mapbox/search-js-react' {
    import { ForwardRefExoticComponent, RefAttributes } from 'react';
  
    interface AddressAutofillProps {
      accessToken: string;
      children: React.ReactNode;  // You may adjust this based on what the component requires
    }
  
    export const AddressAutofill: ForwardRefExoticComponent<AddressAutofillProps & RefAttributes<unknown>>;
  }
  