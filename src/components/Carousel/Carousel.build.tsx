import {
  useEnhancedNode,
  useEnhancedEditor,
  selectResolver,
  IteratorProvider,
} from '@ws-ui/webform-editor';
import { Element } from '@ws-ui/craftjs-core';
import cn from 'classnames';
import { FC } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ICarouselProps } from './Carousel.config';
import { BsFillInfoCircleFill } from 'react-icons/bs';

const Carousel: FC<ICarouselProps> = ({ style, datasource, className, classNames = [] }) => {
  const options: EmblaOptionsType = { axis: 'y', loop: true };
  const { resolver } = useEnhancedEditor(selectResolver);
  const {
    connectors: { connect },
  } = useEnhancedNode();
  const [emblaRef] = useEmblaCarousel(options);

  return (
    <div ref={connect} style={style} className={cn('carousel', className, classNames)}>
      <div className="carousel_container overflow-hidden border" ref={emblaRef}>
        {datasource ? (
          <div className="carousel_slides h-full flex">
            <div className="carousel_slide relative h-full" style={{ flex: '0 0 100%' }}>
              <IteratorProvider>
                <Element
                  id="carousel"
                  className="h-full w-full"
                  role="accordion-header"
                  is={resolver.StyleBox}
                  deletable={false}
                  canvas
                />
              </IteratorProvider>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-purple-400 py-4 text-white">
            <BsFillInfoCircleFill className="mb-1 h-8 w-8" />
            <p>Please attach a datasource</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;
