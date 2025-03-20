"use client"

import useFetchMemes from "@/hooks/useFetchMemes";

import MemeGrid from "@/components/meme-grid";
import {Loader2} from "lucide-react";
import type React from "react";

const Page = () => {

    const {memes, isFetching} = useFetchMemes();


    return <div>
        {memes.length === 0 && !isFetching ? (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-lg">No memes found</p>
            </div>
        ) : (
            <MemeGrid memes={memes} />
        )}

        {isFetching && (
            <div className="flex justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
    </div>
}

export default Page