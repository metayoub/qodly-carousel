import { FC, useEffect } from 'react';
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
import './Carousel.css';
import { ICarouselProps } from './Carousel.config';

const Carousel: FC<ICarouselProps> = ({
  direction,
  loop,
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

  return (
    <>
      <div ref={connect} style={style} className={cn('carousel', className, classNames)}>
        <div className="carousel_container overflow-hidden border" ref={emblaRef}>
          <div className="carousel_slides h-full flex">
            {entities.map((entity, index) => (
              <div
                key={entity.__KEY}
                className="carousel_slide relative h-full"
                style={{ flex: '0 0 100%', paddingLeft: 'var(--slide-spacing)' }}
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
                <button onClick={handlePrev} className="embla__button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 27 27"
                    stroke="currentColor"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button onClick={handleNext} className="embla__button next-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 27 27"
                    stroke="currentColor"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
            {dots && (
              <div className="carousel_dots">
                {entities.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => emblaApi.scrollTo(index)}
                    className={`carousel_dot ${index === emblaApi.selectedScrollSnap() ? 'carousel_dot--active' : ''}`}
                  ></div>
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
