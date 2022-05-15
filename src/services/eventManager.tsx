import { EventType } from '@types';

export class EventManager {

    private _eventListeners = new Map<EventType, ((p_event?: any) => void)[]>();

    constructor() { }

    public addEventListener(eventType: EventType, callback: (p_event?: any) => void): () => void {
        if (!this._eventListeners.has(eventType)) {
            this._eventListeners.set(eventType, []);
        }

        this._eventListeners.get(eventType)?.push(callback);

        return () => {
            const callbacks = this._eventListeners.get(eventType);

            if (callbacks) {
                const index = callbacks.indexOf(callback);

                if (index !== -1) {
                    callbacks.splice(index, 1);
                    this._eventListeners.set(eventType, callbacks);
                }
            }
        };
    }

    public dispatchEvent(eventType: EventType, event?: any) {
        const callbacks = this._eventListeners.get(eventType);

        if (callbacks && callbacks.length > 0) {
            for (const callback of callbacks) {
                callback(event);
            }
        }
    }
}
