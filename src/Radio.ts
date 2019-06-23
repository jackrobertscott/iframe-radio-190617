import { Dispatcher } from 'events-and-things';
import { Elements } from './Elements';

export interface IRadioConstructor {
  id: string;
  node?: Window | null;
}

export class Radio<T> {
  private id: string;
  private node: Window;
  private messageDispatcher: Dispatcher<T>;
  private elementsHandler: Elements;
  private unlistener: () => void;
  /**
   * Attach radio to the window which is listenening
   * for messages.
   */
  constructor({ id, node }: IRadioConstructor) {
    this.id = id;
    this.node = node || window.parent;
    this.messageDispatcher = new Dispatcher();
    this.elementsHandler = new Elements();
    this.unlistener = this.elementsHandler.createListener({
      element: window,
      action: 'message',
      handler: (event: any) => this.handleMessages(event),
    });
  }
  /**
   * Send a message through the radio.
   */
  public message(data: T): void {
    const payload = {
      id: this.id,
      data,
    };
    this.node.postMessage(payload, '*');
  }
  /**
   * Listen to all messages which come through the
   * radio. This returns an unlisten function.
   */
  public listen(callback: () => any): () => void {
    return this.messageDispatcher.watch(callback);
  }
  /**
   * Remove all listeners.
   */
  public destroy(): void {
    if (this.unlistener) {
      this.unlistener();
    }
    this.messageDispatcher.destroy();
  }
  /**
   * Handle the events which are sent via the windows.
   */
  private handleMessages(event: any): void {
    const { id, data } = event.data || ({} as any);
    if (id === this.id) {
      this.messageDispatcher.dispatch(data);
    }
  }
}
