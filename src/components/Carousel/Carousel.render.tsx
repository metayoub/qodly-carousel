import { FC, useCallback, useEffect, useState } from 'react';
import {
  useRenderer,
  useSources,
  useEnhancedEditor,
  selectResolver,
  EntityProvider,
  useDataLoader,
  unsubscribeFromDatasource,
} from '@ws-ui/webform-editor';
import cn from 'classnames';
import { Element } from '@ws-ui/craftjs-core';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ICarouselProps } from './Carousel.config';

const Carousel: FC<ICarouselProps> = ({
  direction,
  loop,
  icon1,
  icon2,
  arrows,
  axis,
  dots,
  style,
  iterator,
  className,
  classNames = [],
  autoplayInterval = 5000,
  autoplay,
}) => {
  const { connect } = useRenderer();
  const options: EmblaOptionsType = { direction: direction, axis: axis, loop: loop };

  const {
    sources: { datasource: ds, currentElement: currentDs },
  } = useSources();
  const { entities, fetchIndex } = useDataLoader({
    source: ds,
  });
  
  const { resolver } = useEnhancedEditor(selectResolver);
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [SelectedScrollSnap, setSelectedScrollSnap] = useState(0);
  useEffect(() => {
    fetchIndex(0);
  }, []);

  useEffect(() => {
    if (!ds) {
      return;
    }

    const cb = () => {
      ds.getValue('length').then((_length) => {
        fetchIndex(0);
      });
    };

    ds.addListener('changed', cb);

    return () => {
      unsubscribeFromDatasource(ds, cb);
    };
  }, [ds, fetchIndex]);

  useEffect(() => {
    let autoplayTimer: NodeJS.Timeout;

    const startAutoplay = () => {
      autoplayTimer = setInterval(() => {
        emblaApi && emblaApi.scrollNext();
      }, autoplayInterval);
    };

    const stopAutoplay = () => {
      clearInterval(autoplayTimer);
    };

    if (emblaApi && autoplay) {
      startAutoplay();
    }

    return () => {
      stopAutoplay();
    };
  }, [emblaApi, autoplayInterval, autoplay]);

  const handlePrev = () => emblaApi && emblaApi.scrollPrev();
  const handleNext = () => emblaApi && emblaApi.scrollNext();

  const onSelect = useCallback(() => {
    if (emblaApi) {
      setSelectedScrollSnap(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);
  return (
    <>
      <div ref={connect} style={style} className={cn('carousel', className, classNames)}>
        <div className="carousel_container overflow-hidden border h-full" ref={emblaRef}>
          <div className="carousel_slides h-full flex">
            {entities.map((entity, index) => (
              <div
                key={entity.__KEY}
                className="carousel_slide relative h-full flex-shrink-0 w-full"
              >
                <EntityProvider
                  index={index}
                  selection={ds}
                  current={currentDs?.id}
                  iterator={iterator}
                >
                  <Element
                    id="carousel"
                    className="h-full w-full"
                    role="carousel-header"
                    is={resolver.StyleBox}
                    canvas
                  />
                </EntityProvider>
              </div>
            ))}
          </div>
        </div>
        {emblaApi && (
          <div>
            {arrows && (
              <div>
                <button
                  onClick={handlePrev}
                  className="absolute top-1/2 transform -translate-y-1/2 carousel_button"
                >
                  <span
                    className={cn(
                      'fa fd-component',
                      'fd-icon',
                      icon2,
                      classNames,
                      'w-7 h-auto fill-current text-gray-400 hover:text-gray-700 ',
                      'text-3xl',
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
                      'w-7 h-auto fill-current ml-2 text-gray-400',
                      'text-3xl ',
                    )}
                  ></span>
                </button>
              </div>
            )}
            {dots && (
              <div className=" flex justify-center relative  bottom-2  hover:bg-black carousel_dots">
                {entities.map((_, index) => (
                  <div>
                    <div
                      key={index}
                      onClick={() => emblaApi.scrollTo(index)}
                      className={cn(
                        'carousel_dot w-8 h-1 bg-gray-400 hover:bg-gray-600 rounded-full mx-1 cursor-pointer transition duration-300',
                        {
                          'active bg-gray-900 hover:bg-gray-700': index === SelectedScrollSnap,
                        },
                      )}
                    ></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Carousel;
