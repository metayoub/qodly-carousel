import { ESetting, TSetting, DEFAULT_ITERATOR } from '@ws-ui/webform-editor';
import { BASIC_SETTINGS, DEFAULT_SETTINGS, load, ETextFieldModifier } from '@ws-ui/webform-editor';
import { validateServerSide } from '@ws-ui/shared';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from 'react-icons/fa';
const commonSettings: TSetting[] = [
  {
    key: 'name',
    label: 'Name',
    type: ESetting.TEXT_FIELD,
    defaultValue: 'Qodly',
  },
  {
    key: 'loop',
    label: 'Loop',
    type: ESetting.CHECKBOX,
    defaultValue: true,
  },
  {
    label: 'Direction',
    type: ESetting.RADIOGROUP,
    defaultValue: 'ltr',
    key: 'direction',
    multiple: false,
    options: [
      {
        value: 'rtl',
        tooltip: 'Righ to Left',
        icon: FaLongArrowAltLeft,
      },
      {
        value: 'ltr',
        tooltip: 'Left to Right',
        icon: FaLongArrowAltRight,
      },
    ],
  },
];

const dataAccessSettings: TSetting[] = [
  {
    key: 'datasource',
    label: 'DataSource',
    type: ESetting.DS_AUTO_SUGGEST,
  },
  {
    key: 'currentElement',
    label: 'Selected Element',
    type: ESetting.DS_AUTO_SUGGEST,
  },
  {
    key: 'iterator',
    label: 'Iterate with',
    type: ESetting.TEXT_FIELD,
    modifier: ETextFieldModifier.ITERATOR,
    placeholder: DEFAULT_ITERATOR,
  },
  {
    key: 'serverSideRef',
    label: 'Server Side',
    type: ESetting.TEXT_FIELD,
    hasError: validateServerSide,
    validateOnEnter: true,
  },
];

const Settings: TSetting[] = [
  {
    key: 'properties',
    label: 'Properties',
    type: ESetting.GROUP,
    components: commonSettings,
  },
  {
    key: 'dataAccess',
    label: 'Data Access',
    type: ESetting.GROUP,
    components: dataAccessSettings,
  },
  ...load(DEFAULT_SETTINGS).filter('dataAccess'),
];

export const BasicSettings: TSetting[] = [
  ...commonSettings,
  ...load(BASIC_SETTINGS).filter('style.overflow'),
];

export default Settings;
