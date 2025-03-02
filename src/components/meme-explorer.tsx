"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { debounce } from "lodash"
import { Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MemeGrid from "@/components/meme-grid"
import { getMemes } from "@/lib/api"

export type MemePost = {
  id: string
  authorId: string
  author: {
    id: string
    name: string
    image?: string
  }
  imageUrl: string
  caption?: string
  createdAt: string
  likes: Array<{ id: string; userId: string }>
  _count?: {
    comments: number
  }
}

export type SortOption = "likes" | "date" | "comments"
export type CategoryOption = "trending" | "new" | "classic" | "random"

export default function MemeExplorer() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial values from URL params or defaults
  const initialCategory = (searchParams?.get("category") as CategoryOption) || "trending"
  const initialSort = (searchParams?.get("sort") as SortOption) || "date"
  const initialSearch = searchParams?.get("search") || ""

  const [memes, setMemes] = useState<MemePost[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<CategoryOption>(initialCategory)
  const [sort, setSort] = useState<SortOption>(initialSort)
  const [search, setSearch] = useState(initialSearch)
  const observer = useRef<IntersectionObserver | null>(null)

  // Update URL with current filters
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams()

    if (category) params.set("category", category)
    if (sort) params.set("sort", sort)
    if (search) params.set("search", search)
    else params.delete("search")

    const newParams = params.toString()
    const currentParams = new URLSearchParams(searchParams?.toString()).toString()

    // Only update if params have changed
    if (newParams !== currentParams) {
      router.push(`?${newParams}`, { scroll: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, searchParams])

  // Debounced search handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value)
      setPage(1)
      setMemes([])
    }, 500),
    [],
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value as CategoryOption)
    setPage(1)
    setMemes([])
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSort(value as SortOption)
    setPage(1)
    setMemes([])
  }

  // Fetch memes based on current filters
  const fetchMemes = useCallback(async () => {
    const newMemes = await getMemes()
    if (loading || !hasMore) return

    setLoading(true)
    try {

      if (newMemes.length === 0) {
        setHasMore(false)
      } else {
        setMemes(newMemes)
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error fetching memes:", error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore])

  // Set up intersection observer for infinite scrolling
  const lastMemeElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1)
          // Don't call fetchMemes() directly here
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore], // Remove fetchMemes from dependencies
  )

  // Effect for URL params update
  useEffect(() => {
    updateUrlParams()
  }, [updateUrlParams])

  // Effect for initial data fetch when filters change
  useEffect(() => {
    setMemes([])
    setPage(1)
    setHasMore(true)
    // Don't call fetchMemes() here, let the page state change trigger it
  }, [category, sort, search])

  // Effect for fetching data when page changes
  useEffect(() => {
    if (page === 1 || hasMore) {
      fetchMemes()
    }
  }, [page, fetchMemes, hasMore])

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Meme Explorer</h1>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search memes..."
              defaultValue={initialSearch}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Tabs defaultValue={category} onValueChange={handleCategoryChange} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="classic">Classic</TabsTrigger>
                <TabsTrigger value="random">Random</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select defaultValue={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="likes">Most Liked</SelectItem>
                <SelectItem value="date">Newest</SelectItem>
                <SelectItem value="comments">Most Comments</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {memes.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-lg">No memes found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setCategory("trending")
                setSort("date")
                setSearch("")
                setPage(1)
                setHasMore(true)
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <MemeGrid memes={memes} lastMemeRef={lastMemeElementRef} />
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}

