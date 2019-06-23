export class Elements {
  /**
   * Create a HTML element with attributes.
   */
  public create({
    tag,
    attributes,
  }: {
    tag: string;
    attributes: { [name: string]: any };
  }) {
    const node = document.createElement(tag);
    Object.assign(node, attributes);
    return node;
  }
  /**
   * Attach a listener to an HTML element. Returns a
   * method which will remove the listener.
   */
  public createListener({
    element,
    action,
    handler,
  }: {
    action: string;
    element: HTMLElement | Document | Window;
    handler: (...args: any[]) => any;
  }): () => void {
    if (element.addEventListener) {
      element.addEventListener(action, handler, false);
    } else if ((element as any).attachEvent) {
      (element as any).attachEvent(`on${action}`, handler);
    }
    return () => this.removeListener({ action, element, handler });
  }
  /**
   * Remove a listener from an HTML element.
   */
  public removeListener({
    element,
    action,
    handler,
  }: {
    action: string;
    element: HTMLElement | Document | Window;
    handler: (...args: any[]) => any;
  }): void {
    if (element.addEventListener) {
      element.removeEventListener(action, handler, false);
    } else if ((element as any).detachEvent) {
      (element as any).detachEvent(`on${action}`, handler);
    }
  }
}
