import { FC, useCallback, useEffect, useState } from 'react';
import {
  useSources,
  useEnhancedEditor,
  selectResolver,
  EntityProvider,
  useDataLoader,
  unsubscribeFromDatasource,
  useEnhancedNode,
} from '@ws-ui/webform-editor';
import cn from 'classnames';
import { Element } from '@ws-ui/craftjs-core';
import { CgDanger } from 'react-icons/cg';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ICarouselProps } from './Carousel.config';
import CarouselDots from './CarouselDots';
import CarouselArrows from './CarouselArrows';

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
  const options: EmblaOptionsType = { direction: direction, axis: axis, loop: loop };
  const { resolver, query } = useEnhancedEditor(selectResolver);
  const {
    linkedNodes,
    connectors: { connect },
  } = useEnhancedNode((node) => {
    return { linkedNodes: node.data.linkedNodes };
  });
  const child = linkedNodes.carousel ? query.node(linkedNodes.carousel).get() : null;
  const childStyle = child?.data.props.style;

  const {
    sources: { datasource: ds, currentElement: currentDs },
  } = useSources();
  const { entities, fetchIndex } = useDataLoader({
    source: ds,
  });

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
      {ds?.initialValue !== undefined ? (
        <div ref={connect} style={style} className={cn('carousel', className, classNames)}>
          <div className="carousel_container overflow-hidden border h-full" ref={emblaRef}>
            <div
              className={cn('carousel_slides h-full flex', {
                'flex-col': axis === 'y',
              })}
            >
              {entities.map((entity, index) => (
                <div
                  key={entity.__KEY}
                  className={`"${index === SelectedScrollSnap ? 'border-2 border-black ' : 'border-1'} carousel_slide relative h-full flex-shrink-0 w-full"`}
                  style={childStyle}
                >
                  <EntityProvider
                    index={index}
                    selection={ds}
                    current={currentDs?.id}
                    iterator={iterator}
                  >
                    <Element
                      id="carousel"
                      className="h-full w-full "
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
                <CarouselArrows
                  onPrevClick={handlePrev}
                  onNextClick={handleNext}
                  iconPrev={icon2}
                  iconNext={icon1}
                  classNames={classNames}
                />
              )}
              {dots && (
                <CarouselDots
                  totalDots={entities.length}
                  selectedDot={SelectedScrollSnap}
                  onDotClick={(index) => emblaApi.scrollTo(index)}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-purple-400 py-4 text-white">
          <CgDanger className="mb-1 h-8 w-8" />
          <p>Missing a datasource</p>
        </div>
      )}
    </>
  );
};

export default Carousel;
