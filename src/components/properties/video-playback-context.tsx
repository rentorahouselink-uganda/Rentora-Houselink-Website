"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type VideoPlaybackContextValue = {
  /** Property ID of the video currently playing, or null if none. */
  activeVideoId: string | null;
  /**
   * Register this card's video as the active one.
   * All other cards that observe this context will stop their preview.
   */
  claimPlayback: (id: string) => void;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const VideoPlaybackContext = createContext<VideoPlaybackContextValue | null>(
  null,
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function VideoPlaybackProvider({ children }: { children: ReactNode }) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const claimPlayback = useCallback((id: string) => {
    setActiveVideoId(id);
  }, []);

  return (
    <VideoPlaybackContext.Provider value={{ activeVideoId, claimPlayback }}>
      {children}
    </VideoPlaybackContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook — degrades gracefully when used outside a provider so PropertyCard
// remains composable on pages that don't wrap with VideoPlaybackProvider.
// ---------------------------------------------------------------------------

const NOOP: VideoPlaybackContextValue = {
  activeVideoId: null,
  claimPlayback: () => {},
};

export function useVideoPlayback(): VideoPlaybackContextValue {
  return useContext(VideoPlaybackContext) ?? NOOP;
}