interface IEvent {
  title: string
  start: Date
  end: Date
}

export class EventService {
  events: IEvent[] = []

  addEvent(event: IEvent) {
    this.events.push(event);
  }
}

export const eventService = new EventService();