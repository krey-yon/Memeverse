"use client"

import {useEffect, useState} from "react";
import {fetchUserMemes} from "@/actions/user";
import {MemePost} from "@/lib/api";

export default function useFetchMemes () {
    const [memes, setMemes] = useState<MemePost[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {

        async function fetch() {
            setIsFetching(true);
            const res = await fetchUserMemes();
            setMemes(res!);
            setIsFetching(false);
        }
        fetch();
    },[]);

    return {memes, isFetching};
}