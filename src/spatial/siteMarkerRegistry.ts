type SiteMarkerHandle = {
  openPopup: () => void;
};

const handles = new Map<string, SiteMarkerHandle>();

/** Imperative popup control so queue focus does not remount map marker children. */
export const siteMarkerRegistry = {
  register(siteId: string, handle: SiteMarkerHandle): () => void {
    handles.set(siteId, handle);
    return () => {
      handles.delete(siteId);
    };
  },
  openPopup(siteId: string): boolean {
    const handle = handles.get(siteId);
    if (handle == null) {
      return false;
    }
    handle.openPopup();
    return true;
  },
};
