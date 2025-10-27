import { ESetting, TSetting, DEFAULT_ITERATOR } from '@ws-ui/webform-editor';
import { BASIC_SETTINGS, DEFAULT_SETTINGS, load, ETextFieldModifier } from '@ws-ui/webform-editor';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from 'react-icons/fa';
import { LuFlipVertical2, LuFlipHorizontal2 } from 'react-icons/lu';
const commonSettings: TSetting[] = [
  {
    key: 'autoplay',
    label: 'Auto play',
    type: ESetting.CHECKBOX,
    defaultValue: true,
  },
  {
    key: 'arrows',
    label: 'Arrows',
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
  {
    label: 'Orientation',
    type: ESetting.RADIOGROUP,
    defaultValue: 'x',
    key: 'axis',
    multiple: false,
    options: [
      {
        value: 'y',
        tooltip: 'vertical',
        icon: LuFlipVertical2,
      },
      {
        value: 'x',
        tooltip: 'Horizontal',
        icon: LuFlipHorizontal2,
      },
    ],
  },
  {
    key: 'icon1',
    label: 'Icon next',
    type: ESetting.ICON_PICKER,
    defaultValue: 'fa-chevron-right',
  },
  {
    key: 'icon2',
    label: 'Icon previous',
    type: ESetting.ICON_PICKER,
    defaultValue: 'fa-chevron-left',
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

  ...load(DEFAULT_SETTINGS).filter(
    'dataAccess',
    'style.color',
    'font',
    'color.boxshadow',
    'style.overflow',
    'background',
  ),
];

export const BasicSettings: TSetting[] = [
  ...commonSettings,
  ...load(BASIC_SETTINGS).filter(
    'style.color',
    'font',
    'color.boxshadow',
    'style.overflow',
    'background',
  ),
];
export default Settings;
