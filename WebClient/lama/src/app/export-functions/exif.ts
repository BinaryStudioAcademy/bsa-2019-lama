export function getLocation(latitude, longitude, geoCoder) {
  return new Promise((resolve, reject) => {
    return geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            const address = results[0];
            resolve(address);
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      }
    );
  });
}
export function getFormattedAdress(adress) {
  return adress.formatted_address;
}
export function getShortAddress(adress) {
  if (adress) {
    let Country;
    let City;
    let address;
    for (const firstEl of adress.address_components) {
      if (firstEl.types[0] === 'country') {
        Country = firstEl.long_name;
      }
      if (firstEl.types[0] === 'administrative_area_level_1') {
        City = firstEl.long_name;
      }
    }
    if (Country !== undefined && City !== undefined) {
      address = Country + ',' + City;
    }
    if (Country === undefined && City !== undefined) {
      address = City;
    }
    if (Country !== undefined && City === undefined) {
      address = Country;
    }
    return address;
  } else {
    console.log('No results found');
  }
}

export function getLatitude(exifObj): number {
  const field = 'GPS';
  let latitude;
  if (exifObj[field][1] === 'N') {
    latitude = ConvertDMSToDD(
      exifObj[field][2][0][0],
      exifObj[field][2][1][0],
      exifObj[field][2][2][0] / exifObj[field][2][2][1],
      exifObj[field][1]
    );
    return latitude;
  }
}

export function getLongitude(exifObj): number {
  const field = 'GPS';
  let longitude;
  if (exifObj[field][1] === 'N') {
    longitude = ConvertDMSToDD(
      exifObj[field][4][0][0],
      exifObj[field][4][0][0],
      exifObj[field][4][0][0] / exifObj[field][4][2][1],
      exifObj[field][3]
    );
    return longitude;
  }
}

export function ConvertDMSToDD(
  degrees: number,
  minutes: number,
  seconds: number,
  direction
): number {
  let dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction === 'S' || direction === 'W') {
    dd = dd * -1;
  }
  return dd;
}
