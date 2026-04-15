import { useEffect, useState } from "react";
import bundledData from "../data/data.json";

const CACHE_KEY = "kuhlshit:festival-data:v1";
const DATA_URL = new URL("../data/data.json", import.meta.url).href;

function readCachedData() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeCachedData(data) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore write failures (private mode/quota).
  }
}

/**
 * Keeps festival data available offline by caching the last successful payload.
 * - Tries runtime fetch of the JSON asset.
 * - Falls back to localStorage cache on fetch failure.
 * - Falls back to bundled JSON when no cache exists.
 */
export function useCachedFestivalData() {
  const [data, setData] = useState(() => readCachedData() || bundledData);
  const [isFromCache, setIsFromCache] = useState(() => !!readCachedData());

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const response = await fetch(DATA_URL, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Failed to load festival data: ${response.status}`);
        }
        const freshData = await response.json();
        if (isCancelled) return;
        setData(freshData);
        setIsFromCache(false);
        writeCachedData(freshData);
      } catch {
        if (isCancelled) return;
        const cached = readCachedData();
        if (cached) {
          setData(cached);
          setIsFromCache(true);
        } else {
          setData(bundledData);
          setIsFromCache(false);
          writeCachedData(bundledData);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { data, isFromCache };
}
