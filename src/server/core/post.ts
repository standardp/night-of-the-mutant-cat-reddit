import { reddit } from '@devvit/web/server';
import { dayKey } from './daily';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: `Night of the Mutant Cat: daily ${dayKey()}`,
  });
};
