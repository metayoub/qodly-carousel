import config, { ICarouselProps } from './Carousel.config';
import { T4DComponent, useEnhancedEditor } from '@ws-ui/webform-editor';
import Build from './Carousel.build';
import Render from './Carousel.render';

const Carousel: T4DComponent<ICarouselProps> = (props) => {
  const { enabled } = useEnhancedEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return enabled ? <Build {...props} /> : <Render {...props} />;
};

Carousel.craft = config.craft;
Carousel.info = config.info;
Carousel.defaultProps = config.defaultProps;

export default Carousel;
