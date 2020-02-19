import { EventsModule } from '../modules/events/events.module';

export const ReadEvents = (events: EventsModule[]) => {
    return {
        type: "READ_EVENTS",
        payload: events
    }
}