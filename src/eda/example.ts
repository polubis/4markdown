import { EventsChannel } from './events-channel';

const c = new EventsChannel({
  first: async (payload: { name: string }) => {
    console.log(`first`, payload);
  },
  second: async (payload: { name: string; description: string }) => {
    console.log(`second`, payload); // Logs once.
  },
  third: async (payload: number) => {
    console.log(`third`, payload); // Logs three times.
  },
});

c.dispatch(`third`, 23);

const subscriber = c.subscribe(`third`, (payload) => {
  console.log(`Hi, hello`, payload); // Logs only once.
});

c.dispatch(`third`, 23);

c.dispatch(`second`, { name: `temp`, description: `temp` });

c.unsubscribe(subscriber);

c.dispatch(`third`, 23);
