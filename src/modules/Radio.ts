import { Elements } from './Elements';

export interface IRadioOptions {
  id: string;
  debug?: boolean;
}

export interface IRadioNode {
  node: Window;
  unlisten: () => void;
}

export interface IRadioListener {
  namespace: string;
  callback: (data: any) => void;
}

export class Radio {
  private id: string;
  private debug: boolean;
  private connections: Map<number, IRadioNode>;
  private listeners: Map<number, IRadioListener>;
  private elements: Elements;
  /**
   * Create an instance of the radio.
   */
  constructor({ id, debug }: IRadioOptions) {
    this.id = id;
    this.debug = debug || false;
    this.connections = new Map();
    this.listeners = new Map();
    this.elements = new Elements();
  }
  /**
   * Listen to the events sent from the
   * window provided to this function and returns
   * an remove function. Listener must be applied to
   * the top level window element or it breaks.
   */
  public tether(node?: Window | null): () => void {
    const actor = (event: any) => this.handle(event);
    const unlisten = this.elements.createListener('message', window, actor);
    return this.register(this.connections, {
      node: node || window.parent,
      unlisten,
    });
  }
  /**
   * Send a message out to the connected windows.
   */
  public message(namespace: string, data: any) {
    this.connections.forEach(({ node }) => {
      const payload = {
        id: this.id,
        namespace,
        data,
      };
      node.postMessage(payload, '*');
    });
  }
  /**
   * Register an callback to events of a
   * namespace which are sent through the listeners.
   */
  public on(namespace: string, callback: (data: any) => void) {
    const data = {
      namespace,
      callback,
    };
    return this.register(this.listeners, data);
  }
  /**
   * Remove all event listeners.
   */
  public destroy() {
    this.connections.forEach(({ unlisten }) => unlisten());
  }
  /**
   * Handle the events which are sent via the windows.
   */
  private handle(event: any) {
    const { id, namespace, data } = event.data || ({} as any);
    if (id === this.id) {
      if (this.debug) {
        console.log(`Message received for "${namespace}":`, data);
      }
      this.listeners.forEach(listener => {
        if (listener.namespace === namespace) {
          listener.callback(data);
        }
      });
    }
  }
  /**
   * Register an item on a map and return
   * the unregister function.
   */
  private register(map: Map<number, unknown>, data: unknown) {
    let id: number;
    do {
      id = Math.random();
    } while (map.has(id));
    map.set(id, data);
    return () => {
      if (map.has(id)) {
        map.delete(id);
      }
    };
  }
}
