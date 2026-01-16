import { tva } from '@gluestack-ui/nativewind-utils/tva';

export const progressStyle = tva({
    base: 'bg-background-300 w-full rounded-full h-2 overflow-hidden',
});

export const progressFilledTrackStyle = tva({
    base: 'bg-primary-500 h-full rounded-full',
});
