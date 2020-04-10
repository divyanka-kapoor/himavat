import {Platform} from 'react-native';

export const IS_ANDROID = Platform.OS === 'android';
export const DEFAULT_CENTER_COORDINATE = [78.962883, 20.593683];
export const SF_OFFICE_COORDINATE = [78.962883, 20.593683];

export function onSortOptions(a, b) {
  if (a.label < b.label) {
    return -1;
  }

  if (a.label > b.label) {
    return 1;
  }

  return 0;
}
