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
import { FC, useEffect, useState } from 'react';
import { ICarouselProps } from './Carousel.config';
import { Element } from '@ws-ui/craftjs-core';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

const Carousel: FC<ICarouselProps> = ({ style, iterator, className, classNames = [] }) => {
  const { connect } = useRenderer();
  const options: EmblaOptionsType = { loop: true };
  const {
    sources: { datasource: ds, currentElement: currentDs },
  } = useSources();
  const { fetchIndex } = useDataLoader({
    source: ds,
  });
  const { resolver } = useEnhancedEditor(selectResolver);
  const [emblaRef] = useEmblaCarousel(options);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!ds) {
      return;
    }
    ds.getValue('length').then((value) => {
      setCount(value || 0);
    });

    const cb = () => {
      ds.getValue('length').then((length) => {
        setCount(length);
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
          {[...Array(count).keys()].map((index) => (
            <div
              key={index}
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
