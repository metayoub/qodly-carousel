import { EComponentKind, T4DComponentConfig } from '@ws-ui/webform-editor';
import { Settings } from '@ws-ui/webform-editor';
import { MdOutlineViewCarousel } from 'react-icons/md';

import CarouselSettings, { BasicSettings } from './Carousel.settings';

export default {
  craft: {
    displayName: 'Carousel',
    rules: {
      canMoveIn: () => true,
      canMoveOut: () => true,
    },
    sanityCheck: {
      keys: [{ name: 'datasource', require: true, isDatasource: true }],
    },
    requiredFields: {
      keys: ['datasource'],
      all: false,
    },
    kind: EComponentKind.BASIC,
    props: {
      name: '',
      classNames: [],
      events: [],
    },
    related: {
      settings: Settings(CarouselSettings, BasicSettings),
    },
  },
  info: {
    displayName: 'Carousel',
    exposed: true,
    icon: MdOutlineViewCarousel,
    events: [
      {
        label: 'On Click',
        value: 'onclick',
      },
      {
        label: 'On Blur',
        value: 'onblur',
      },
      {
        label: 'On Focus',
        value: 'onfocus',
      },
      {
        label: 'On MouseEnter',
        value: 'onmouseenter',
      },
      {
        label: 'On MouseLeave',
        value: 'onmouseleave',
      },
      {
        label: 'On KeyDown',
        value: 'onkeydown',
      },
      {
        label: 'On KeyUp',
        value: 'onkeyup',
      },
    ],
    datasources: {
      accept: ['entitysel', 'array'],
    },
  },
  defaultProps: {
    iterable: true,
    style: {
      height: '400px',
    },
    direction: 'ltr',
    arrows: true,
    axis: 'x',
    autoplayInterval: 5000,
    autoplay: true,
    icon1: 'fa-chevron-right',
    icon2: 'fa-chevron-left',
  },
} as T4DComponentConfig<ICarouselProps>;

export interface ICarouselProps extends webforms.ComponentProps {
  direction?: 'ltr' | 'rtl';
  axis?: 'y' | 'x';
  arrows?: boolean;
  autoplayInterval?: number;
  autoplay: boolean;
  icon1: string;
  icon2: string;
}
