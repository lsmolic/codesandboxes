const dig = (target: any, key: string, defaultValue: any) => {
  let dug = target;
  const keys = key.split(".");
  for (const key of keys) {
    if (typeof dug === "undefined" || dug === null) {
      return defaultValue !== undefined ? defaultValue : undefined;
    }
    dug = dug[key];
  }
  return dug != null ? dug : defaultValue;
};

type AddressObject = {
  city: string | null;
  country: string | null;
  formattedAddress: string | null;
  lat: number | null;
  lng: number | null;
  modified: number | null;
  placeId: string | null;
  state: string | null;
  streetName: string | null;
  streetNumber: number | null;
  zipCode: string | null;
};

declare interface GoogleAddressInterface {
  _addressObject: AddressObject | null;
  _defineProperty(self: GoogleAddress, fieldName: string): void;
  populateFromAddressLookup(
    addressString: string,
    place: google.maps.Place,
    latLng: {
      lat: number;
      lng: number;
    }
  ): void;
  populateFromCityLookup(
    addressString: string,
    place: google.maps.Place,
    latLng: { lat: number; lng: number }
  ): void;
  staticMapImageUrl(size: string, marker: { lat: string; lng: string }): string;
  toString(): string;
  valueOf(): AddressObject;
}

class GoogleAddress implements GoogleAddressInterface {
  _addressObject = null;
  constructor() {
    var self = this;
    this._addressObject = {
      city: null,
      country: null,
      formattedAddress: null,
      lat: null,
      lng: null,
      modified: new Date().getTime(),
      placeId: null,
      state: null,
      streetName: null,
      streetNumber: null,
      zipCode: null
    };
    for (var fieldName in self._addressObject) {
      self._addressObject[fieldName] = self[fieldName];
      this._defineProperty(self, fieldName);
    }

    Object.defineProperty(self, "fields", {
      get: () => {
        return this._addressObject;
      }
    });
  }

  static parse(googleAddress) {
    return Object.assign(new GoogleAddress(), googleAddress);
  }

  populateFromAddressLookup(addressString, place, latLng) {
    if (addressString) {
      this._addressObject.formattedAddress = addressString;
      if (place) {
        this._addressObject.placeId = place.place_id;
        this._addressObject.streetNumber = dig(
          place,
          "address_components.0.long_name",
          null
        );
        this._addressObject.streetName = dig(
          place,
          "address_components.1.long_name",
          null
        );
        this._addressObject.city = dig(
          place,
          "address_components.2.long_name",
          null
        );
        this._addressObject.state = dig(
          place,
          "address_components.4.long_name",
          null
        );
        this._addressObject.country = dig(
          place,
          "address_components.5.long_name",
          null
        );
        this._addressObject.zipCode = dig(
          place,
          "address_components.6.long_name",
          null
        );
        if (latLng) {
          this._addressObject.lat = latLng.lat;
          this._addressObject.lng = latLng.lng;
        }
      }
    }
  }

  populateFromCityLookup(addressString, place, latLng) {
    if (addressString) {
      this._addressObject.formattedAddress = addressString;
      if (place) {
        this._addressObject.placeId = place.place_id;
        this._addressObject.city = dig(
          place,
          "address_components.0.long_name",
          null
        );
        this._addressObject.state = dig(
          place,
          "address_components.2.long_name",
          null
        );
        this._addressObject.country = dig(
          place,
          "address_components.5.long_name",
          null
        );
        this._addressObject.zipCode = dig(
          place,
          "address_components.6.long_name",
          null
        );
        if (latLng) {
          this._addressObject.lat = latLng.lat;
          this._addressObject.lng = latLng.lng;
        }
      }
    }
  }

  staticMapImageUrl(size, marker) {
    const address = this._addressObject.formattedAddress;
    return GoogleAddress.staticMapImageUrl(address, size, marker);
  }

  static staticMapImageUrl(formattedAddress, size, marker) {
    const googleApiKey = "googleKey";
    let url = `https://maps.googleapis.com/maps/api/staticmap?center=${formattedAddress}&size=${size}&key=${googleApiKey}`;
    if (marker)
      url += `&markers=color:red%7Clabel:1%7C${marker.lat},${marker.lng}`;

    return url;
  }

  _defineProperty(self, fieldName) {
    Object.defineProperty(self, fieldName, {
      get: () => {
        return self._addressObject[fieldName];
      },
      set: newValue => {
        self._addressObject[fieldName] = newValue;
        self._addressObject["modified"] = new Date().getTime();
      }
    });
  }

  toString() {
    return this._addressObject.formattedAddress;
  }

  valueOf() {
    return this._addressObject;
  }

  get [Symbol.toStringTag](): string {
    return "GoogleAddress";
  }

  [Symbol.iterator]() {
    const properties = Object.keys(this._addressObject).map(key => {
      return { [key]: this._addressObject[key] };
    });
    let currentPropertyIndex = 0;
    return {
      next() {
        const endOfList = !(currentPropertyIndex < properties.length);
        if (endOfList) {
          return {
            value: undefined,
            done: true
          };
        }
        currentPropertyIndex++;
        return {
          value: properties[currentPropertyIndex],
          done: false
        };
      }
    };
  }
}
const googleAddressOne = GoogleAddress.parse({
  city: "Los Angeles",
  country: "USA",
  formattedAddress: "2342 Lemon Lane, Los Angeles, CA, USA 90034",
  lat: 23.234023,
  lng: -123.23424,
  placeId: "place_09asdfoiuasd90fjasdfas09dfu",
  state: "CA",
  streetName: "Lemon Lane",
  streetNumber: 2342,
  zipCode: "90034"
});

let productionLocation = {
  hello: "world",
  ...googleAddressOne.fields
};

console.log(productionLocation);
console.log(Object.assign({}, ...googleAddressOne));
