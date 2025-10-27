import { FC, useCallback, useEffect, useRef, useState } from 'react';
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
import { EmblaOptionsType, EngineType, EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ICarouselProps } from './Carousel.config';
import CarouselArrows from './CarouselArrows';

const Carousel: FC<ICarouselProps> = ({
  direction,
  icon1,
  icon2,
  arrows,
  axis,
  style,
  iterator,
  className,
  classNames = [],
  autoplayInterval = 5000,
  autoplay,
}) => {
  const [hasMoreToLoad, setHasMoreToLoad] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollListenerRef = useRef<() => void>(() => undefined);
  const listenForScrollRef = useRef(true);
  const hasMoreToLoadRef = useRef(true);
  const lengthRef = useRef(0);
  const pageSizeRef = useRef(100);
  const { resolver, query } = useEnhancedEditor(selectResolver);
  const {
    linkedNodes,
    connectors: { connect },
  } = useEnhancedNode((node) => {
    return { linkedNodes: node.data.linkedNodes };
  });

  const options: EmblaOptionsType = {
    direction: direction,
    axis: axis,
    // loop: loop,
    dragFree: true,
    containScroll: 'keepSnaps',
    watchResize: false,
    watchSlides: (emblaApi) => {
      const reloadEmbla = (): void => {
        const oldEngine = emblaApi.internalEngine();

        emblaApi.reInit();
        const newEngine = emblaApi.internalEngine();
        const copyEngineModules: (keyof EngineType)[] = [
          'scrollBody',
          'location',
          'offsetLocation',
          'previousLocation',
          'target',
        ];
        copyEngineModules.forEach((engineModule) => {
          Object.assign(newEngine[engineModule], oldEngine[engineModule]);
        });

        newEngine.translate.to(oldEngine.location.get());
        const { index } = newEngine.scrollTarget.byDistance(0, false);
        newEngine.index.set(index);
        newEngine.animation.start();

        setLoadingMore(false);
        listenForScrollRef.current = true;
      };

      const reloadAfterPointerUp = (): void => {
        emblaApi.off('pointerUp', reloadAfterPointerUp);
        reloadEmbla();
      };

      const engine = emblaApi.internalEngine();

      if (hasMoreToLoadRef.current && engine.dragHandler.pointerDown()) {
        const boundsActive = engine.limit.reachedMax(engine.target.get());
        engine.scrollBounds.toggleActive(boundsActive);
        emblaApi.on('pointerUp', reloadAfterPointerUp);
      } else {
        reloadEmbla();
      }
    },
  };

  const child = linkedNodes.carousel ? query.node(linkedNodes.carousel).get() : null;
  const childStyle = child?.data.props.style;

  const {
    sources: { datasource: ds, currentElement: currentDs },
  } = useSources();
  const { page, setStep, entities, fetchIndex } = useDataLoader({
    source: ds,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  useEffect(() => {
    if (!ds) return;
    const fetch = async () => {
      const fetchedLength = await ds.getValue('length');
      // WorkAround to fetch only the PageSize
      const pageSize = ds.getPageSize();
      pageSizeRef.current = pageSize;
      lengthRef.current = fetchedLength;
      setStep({
        start: 0,
        end: pageSize,
      });

      fetchIndex(0);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!ds) {
      return;
    }

    const cb = async () => {
      const fetchedLength = await ds.getValue('length');
      lengthRef.current = fetchedLength;
      const pageSize = ds.getPageSize();
      pageSizeRef.current = pageSize;
      setStep({
        start: 0,
        end: pageSize,
      });
      fetchIndex(0);
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

  const onScroll = useCallback(
    (emblaApi: EmblaCarouselType) => {
      if (!listenForScrollRef.current) return;
      setLoadingMore((loadingMore) => {
        const lastSlide = emblaApi.slideNodes().length - 1;
        const lastSlideInView = emblaApi.slidesInView().includes(lastSlide);
        const loadMore = !loadingMore && lastSlideInView;
        if (loadMore) {
          const firstSlideInView = emblaApi.slidesInView()[0];
          listenForScrollRef.current = false;
          setStep({
            start: firstSlideInView,
            end:
              firstSlideInView + pageSizeRef.current < lengthRef.current
                ? firstSlideInView + pageSizeRef.current
                : lengthRef.current,
          });
          fetchIndex(0);

          setHasMoreToLoad(false);
          emblaApi.off('scroll', scrollListenerRef.current);
        }

        return loadingMore || lastSlideInView;
      });
    },
    [lengthRef.current, pageSizeRef.current], // maybe you will need page.end, fetchIndex, setStep
  );

  const addScrollListener = useCallback(
    (emblaApi: EmblaCarouselType) => {
      scrollListenerRef.current = () => onScroll(emblaApi);
      emblaApi.on('scroll', scrollListenerRef.current);
    },
    [onScroll],
  );

  useEffect(() => {
    if (!emblaApi) return;
    addScrollListener(emblaApi);

    const onResize = () => emblaApi.reInit();
    window.addEventListener('resize', onResize);
    emblaApi.on('destroy', () => window.removeEventListener('resize', onResize));
  }, [emblaApi, addScrollListener]);

  useEffect(() => {
    hasMoreToLoadRef.current = hasMoreToLoad;
  }, [hasMoreToLoad]);

  return (
    <>
      {ds?.initialValue !== undefined ? (
        <div
          ref={connect}
          style={style}
          className={cn('carousel', className, classNames)}
          dir={direction}
        >
          <div className="carousel_container overflow-hidden border h-full" ref={emblaRef}>
            <div
              className={cn('carousel_slides h-full flex', {
                'flex-col': axis === 'y',
              })}
            >
              {entities.map((entity, index) => (
                <div
                  key={entity.__KEY}
                  className={`carousel_slide relative h-full flex-shrink-0 w-full"`}
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
              {(hasMoreToLoad || page.fetching) && (
                <div
                  className={'carousel-infinite-scroll'.concat(
                    loadingMore ? ' carousel-infinite-scroll--loading-more' : '',
                  )}
                >
                  loading ...
                  <span className="carousel-infinite-scroll__spinner" />
                </div>
              )}
            </div>
          </div>
          {emblaApi && (
            <>
              {arrows && (
                <CarouselArrows
                  onPrevClick={handlePrev}
                  onNextClick={handleNext}
                  iconPrev={icon2}
                  iconNext={icon1}
                  classNames={classNames}
                />
              )}
            </>
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
