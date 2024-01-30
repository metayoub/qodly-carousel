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
import { FC, useEffect } from 'react';
import { ICarouselProps } from './Carousel.config';
import { Element } from '@ws-ui/craftjs-core';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

const Carousel: FC<ICarouselProps> = ({
  direction,
  style,
  iterator,
  className,
  classNames = [],
}) => {
  const { connect } = useRenderer();
  const options: EmblaOptionsType = { direction: direction };
  const {
    sources: { datasource: ds, currentElement: currentDs },
  } = useSources();
  const { entities, fetchIndex } = useDataLoader({
    source: ds,
  });
  const { resolver } = useEnhancedEditor(selectResolver);
  const [emblaRef] = useEmblaCarousel(options);

  useEffect(() => {
    fetchIndex(0);
  }, []);
  useEffect(() => {
    if (!ds) {
      return;
    }

    const cb = () => {
      ds.getValue('length').then((length) => {
        fetchIndex(0);
      });
    };

    ds.addListener('changed', cb);

    return () => {
      unsubscribeFromDatasource(ds, cb);
    };
  }, [ds, fetchIndex]);

  return (
    <div ref={connect} style={style} className={cn('carousel', className, classNames)}>
      <div className="carousel_container overflow-hidden border" ref={emblaRef}>
        <div className="carousel_slides h-full flex">
          {entities.map((entity, index) => (
            <div
              key={entity.__KEY}
              className="carousel_slide relative h-full"
              style={{ flex: '0 0 100%' }}
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
                  role="accordion-header"
                  is={resolver.StyleBox}
                  canvas
                />
              </EntityProvider>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
