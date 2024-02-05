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

const Carousel: FC<ICarouselProps> = ({
  arrows,
  direction,
  icon1,
  dots,
  loop,
  axis,
  icon2,
  style,
  datasource,
  className,
  classNames = [],
}) => {
  const options: EmblaOptionsType = { direction: direction, axis: axis, loop: loop };
  const { resolver } = useEnhancedEditor(selectResolver);
  const {
    connectors: { connect },
  } = useEnhancedNode();
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const handlePrev = () => emblaApi && emblaApi.scrollPrev();
  const handleNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div ref={connect} style={style} className={cn('carousel', className, classNames)}>
      <div className="carousel_container overflow-hidden border" ref={emblaRef}>
        {datasource ? (
          <div className="carousel_slides h-full flex">
            <div className="carousel_slide relative h-full flex-shrink-0 w-full">
              <IteratorProvider>
                <Element
                  id="carousel"
                  className="h-full w-full"
                  role="carousel-header"
                  is={resolver.StyleBox}
                  deletable={false}
                  canvas
                />
              </IteratorProvider>
            </div>
            <div className="flex justify-center">
              {arrows && (
                <div>
                  <button
                    onClick={handlePrev}
                    className=" absolute left-0 top-1/2 transform -translate-y-1/2 carousel_button"
                  >
                    <span
                      className={cn(
                        'fa fd-component',
                        'fd-icon',
                        icon2,
                        classNames,
                        'w-7 h-auto fill-current text-gray-700 hover:text-gray-700 ',
                      )}
                    ></span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="absolute text-zinc-950 hover:text-zinc-400 right-0 top-1/2 transform -translate-y-1/2 right-0 carousel_button"
                  >
                    <span
                      className={cn(
                        'fa fd-component',
                        'fd-icon',
                        icon1,
                        classNames,
                        'w-7 h-auto fill-current ml-2 text-gray-700 hover:text-gray-700  ',
                      )}
                    ></span>
                  </button>
                </div>
              )}
              {dots && (
                <div className="carousel_dots absolute bottom-1 w-full flex justify-center right-2">
                  <div className="carousel_dot w-8 h-1 bg-gray-400 hover:bg-gray-600 rounded-full mx-2 cursor-pointer transition duration-300"></div>
                  <div className="carousel_dot w-8 h-1 bg-gray-400 hover:bg-gray-600 rounded-full mx-2 cursor-pointer transition duration-300"></div>
                  <div className="carousel_dot w-8 h-1 bg-gray-400 hover:bg-gray-600 rounded-full mx-2 cursor-pointer transition duration-300"></div>
                </div>
              )}
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
