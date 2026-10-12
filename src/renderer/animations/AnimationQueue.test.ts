import { it, expect } from 'vitest';
import { AnimationQueue } from './AnimationQueue';
const deferred = () => {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => (resolve = r));
  return { promise, resolve };
};
it('serializes awaited events and skips an active task', async () => {
  const q = new AnimationQueue(),
    order: string[] = [],
    wait = deferred();
  const complete = q.enqueue([
    {
      label: 'first',
      run: async (signal) => {
        order.push('first');
        await new Promise<void>((r) => {
          signal.addEventListener('abort', () => r(), { once: true });
          wait.promise.then(r);
        });
        order.push('first-done');
      },
    },
    {
      label: 'second',
      run: async () => {
        order.push('second');
      },
    },
  ]);
  expect(q.length).toBe(2);
  q.skip();
  await complete;
  expect(order).toEqual(['first', 'first-done', 'second']);
  expect(q.length).toBe(0);
});
it('cancel and restart prevents old drain from consuming the new queue', async () => {
  const q = new AnimationQueue(),
    order: string[] = [],
    wait = deferred();
  const old = q.enqueue([
    {
      label: 'old',
      run: async () => {
        order.push('old');
        await wait.promise;
      },
    },
    {
      label: 'must-not-run',
      run: async () => {
        order.push('bad');
      },
    },
  ]);
  q.cancel();
  await q.enqueue([
    {
      label: 'new',
      run: async () => {
        order.push('new');
      },
    },
  ]);
  wait.resolve();
  await old;
  expect(order).toEqual(['old', 'new']);
  expect(q.length).toBe(0);
});
