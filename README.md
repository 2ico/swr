[![SWR](https://assets.vercel.com/image/upload/v1572289618/swr/banner.png)](https://swr.vercel.app)

<p align="center">
  <a aria-label="Vercel logo" href="https://vercel.com">
    <img src="https://badgen.net/badge/icon/Made%20by%20Vercel?icon=zeit&label&color=black&labelColor=black">
  </a>
  <br/>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/swr">
    <img alt="" src="https://badgen.net/npm/v/swr">
  </a>
  <a aria-label="Package size" href="https://bundlephobia.com/result?p=swr">
    <img alt="" src="https://badgen.net/bundlephobia/minzip/swr">
  </a>
  <a aria-label="License" href="https://github.com/vercel/swr/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/swr">
  </a>
</p>

## SWR useFocusEffect Deduplication Fix

This fork addresses a critical issue with SWR in React Native (Expo) where screen focus revalidations using `useFocusEffect` from `expo-router` or `@react-navigation/native` don't properly dedupe with ongoing `useSWR` requests, leading to duplicate network calls.

### The Problem

In React Native, the common pattern for revalidating data on screen focus:

```js
const { data, mutate } = useSWR('/api/data', fetcher);

useFocusEffect(
  useCallback(() => {
    mutate(); // This doesn't dedupe with ongoing useSWR requests!
  }, [mutate])
);
```

This causes duplicate requests when users navigate between screens or quickly background/foreground the app. **Note**: In SWR v1, the `revalidate` function was exposed and properly deduped with ongoing requests, but starting with SWR v2, it was removed from the public interface, leaving only `mutate()` which bypasses deduplication.

### The Solution

This fork exposes SWR's internal focus revalidation system, allowing proper deduplication:

#### New Exported Functions

- **`triggerFocusRevalidation(cache?)`** - Triggers focus revalidation for all SWR hooks
- **`triggerKeyFocusRevalidation(key, cache?)`** - Triggers focus revalidation for a specific key

#### Usage

```typescript
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { triggerFocusRevalidation, triggerKeyFocusRevalidation } from 'swr';

/**
 * Hook that triggers focus revalidation for all SWR hooks when the screen comes into focus.
 * Uses SWR's internal focus revalidation mechanism, ensuring proper deduplication with
 * ongoing requests from initial useSWR calls.
 */
export const useFocusRevalidateAll = () => {
  useFocusEffect(
    useCallback(() => {
      triggerFocusRevalidation();
    }, [])
  );
};

/**
 * Hook that triggers focus revalidation for a specific SWR key when the screen comes into focus.
 * Uses SWR's internal focus revalidation mechanism, ensuring proper deduplication with
 * ongoing requests from initial useSWR calls.
 * 
 * @param key - The SWR key to revalidate on focus
 */
export const useFocusRevalidateKey = (key: string | null) => {
  useFocusEffect(
    useCallback(() => {
      if (!key) return;
      triggerKeyFocusRevalidation(key);
    }, [key])
  );
};
```

#### Benefits

- ✅ **Proper Deduplication**: Focus revalidations dedupe with initial `useSWR` fetches
- ✅ **No Duplicate Requests**: Eliminates double-request issues on screen focus and app state changes
- ✅ **Consistent with SWR**: Uses same internal mechanism as built-in `revalidateOnFocus`
- ✅ **Backward Compatible**: All existing SWR functionality remains unchanged

---

## Introduction

SWR is a React Hooks library for data fetching.

The name “**SWR**” is derived from `stale-while-revalidate`, a cache invalidation strategy popularized by [HTTP RFC 5861](https://tools.ietf.org/html/rfc5861).
**SWR** first returns the data from cache (stale), then sends the request (revalidate), and finally comes with the up-to-date data again.

With just one hook, you can significantly simplify the data fetching logic in your project. And it also covered in all aspects of speed, correctness, and stability to help you build better experiences:

- **Fast**, **lightweight** and **reusable** data fetching
- Transport and protocol agnostic
- Built-in **cache** and request deduplication
- **Real-time** experience
- Revalidation on focus
- Revalidation on network recovery
- Polling
- Pagination and scroll position recovery
- SSR and SSG
- Local mutation (Optimistic UI)
- Built-in smart error retry
- TypeScript
- React Suspense
- React Native

...and a lot more.

With SWR, components will get **a stream of data updates constantly and automatically**. Thus, the UI will be always **fast** and **reactive**.

---

**View full documentation and examples on [swr.vercel.app](https://swr.vercel.app).**

<br/>

## Quick Start

```js
import useSWR from 'swr'

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

In this example, the React Hook `useSWR` accepts a `key` and a `fetcher` function.
The `key` is a unique identifier of the request, normally the URL of the API. And the `fetcher` accepts
`key` as its parameter and returns the data asynchronously.

`useSWR` also returns 3 values: `data`, `isLoading` and `error`. When the request (fetcher) is not yet finished,
`data` will be `undefined` and `isLoading` will be `true`. When we get a response, it sets `data` and `error` based on the result
of `fetcher`, `isLoading` to false and rerenders the component.

Note that `fetcher` can be any asynchronous function, you can use your favourite data-fetching
library to handle that part.

---

**View full documentation and examples on [swr.vercel.app](https://swr.vercel.app).**

<br/>

## Authors

This library is created by the team behind [Next.js](https://nextjs.org), with contributions from our community:

- Shu Ding ([@shuding\_](https://x.com/shuding_)) - [Vercel](https://vercel.com)
- Jiachi Liu ([@huozhi](https://x.com/huozhi)) - [Vercel](https://vercel.com)
- Guillermo Rauch ([@rauchg](https://x.com/rauchg)) - [Vercel](https://vercel.com)
- Joe Haddad ([@timer150](https://x.com/timer150)) - [Vercel](https://vercel.com)
- Paco Coursey ([@pacocoursey](https://x.com/pacocoursey)) - [Vercel](https://vercel.com)

[Contributors](https://github.com/vercel/swr/graphs/contributors)

Thanks to Ryan Chen for providing the awesome `swr` npm package name!

<br/>

## License

The MIT License.
