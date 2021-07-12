export function dynamicLoadJs(url: string) {
  return new Promise((resolve) => {
    const element = document.createElement('script');
    element.setAttribute('type', 'text/javascript');
    element.src = url;
    element.onload = resolve;
    document.body.appendChild(element);
  });
}
