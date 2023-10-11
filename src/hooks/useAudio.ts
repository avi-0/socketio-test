import { useEffect, useMemo } from "react";

type Options = {
    volume?: number,
}

export function useAudio(
    url: string,
    {
        volume = 1.0,
    }: Options = {}
) {
    const audio = useMemo(() => {
        return new Audio(url);
    }, [url]);

    useEffect(() => {
        audio.volume = volume;
    }, [audio, volume]);

    return audio;
}