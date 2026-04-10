import React from 'react';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';

import { Slide01Cover } from './slides/Slide01Cover';
import { Slide02WhoIsSaying } from './slides/Slide02WhoIsSaying';
import { Slide03WhatIsAGI } from './slides/Slide03WhatIsAGI';
import { Slide04WhatIsMoney } from './slides/Slide04WhatIsMoney';
import { Slide05Divergence } from './slides/Slide05Divergence';
import { Slide05StillValuable } from './slides/Slide05StillValuable';
import { Slide06FinancialMystery } from './slides/Slide06FinancialMystery';
import { Slide07NotSciFi } from './slides/Slide07NotSciFi';
import { Slide08Perspective } from './slides/Slide08Perspective';
import { Slide09Closing } from './slides/Slide09Closing';

export const DECK_FPS = 30;
export const DECK_WIDTH = 1920;
export const DECK_HEIGHT = 1080;

/** How long each slide stays "alive" in the timeline. */
export const SLIDE_DURATION_FRAMES = 240; // 8 seconds at 30fps
/** How long the cross-fade between slides lasts. */
export const TRANSITION_DURATION_FRAMES = 18; // 0.6s

const slides = [
  Slide01Cover,
  Slide02WhoIsSaying,
  Slide03WhatIsAGI,
  Slide04WhatIsMoney,
  Slide05Divergence,
  Slide05StillValuable,
  Slide06FinancialMystery,
  Slide07NotSciFi,
  Slide08Perspective,
  Slide09Closing,
];

export const SLIDES_COUNT = slides.length;

export const Deck: React.FC = () => {
  const items: React.ReactNode[] = [];

  slides.forEach((SlideComponent, index) => {
    items.push(
      <TransitionSeries.Sequence
        key={`slide-${index}`}
        durationInFrames={SLIDE_DURATION_FRAMES}
      >
        <SlideComponent />
      </TransitionSeries.Sequence>,
    );
    if (index < slides.length - 1) {
      items.push(
        <TransitionSeries.Transition
          key={`trans-${index}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION_FRAMES })}
        />,
      );
    }
  });

  return <TransitionSeries>{items}</TransitionSeries>;
};
