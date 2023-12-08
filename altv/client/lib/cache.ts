/**
 * Create a provider that will only be called once.
 * @param eager Defaults to `false` Defines if the provider should be called directly when
 * setting up the cached provider
 */
export function cached<T>(provider: Provider<T>, eager?: boolean): Provider<T> {
  let cache: any = eager ? provider() : null;
  return function resultingProvider() {
    if (!cache) cache = provider();
    return cache;
  };
}
