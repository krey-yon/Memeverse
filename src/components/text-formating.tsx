"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic } from "lucide-react"

interface TextFormattingProps {
  position: string
  setPosition: (value: string) => void
  textColor: string
  setTextColor: (value: string) => void
  fontSize: number
  setFontSize: (value: number) => void
  textAlign: "left" | "center" | "right"
  setTextAlign: (value: "left" | "center" | "right") => void
  isBold: boolean
  setIsBold: (value: boolean) => void
  isItalic: boolean
  setIsItalic: (value: boolean) => void
}

export default function TextFormatting({
  position,
  setPosition,
  textColor,
  setTextColor,
  fontSize,
  setFontSize,
  textAlign,
  setTextAlign,
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
}: TextFormattingProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Text Formatting</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Position</label>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="middle">Middle</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Text Color</label>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded border">
              <Input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10 p-0 border-0"
              />
            </div>
            <Input
              type="text"
              value={textColor.toUpperCase()}
              onChange={(e) => setTextColor(e.target.value)}
              className="font-mono uppercase"
              maxLength={7}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Font Size: {fontSize}px</label>
        <Slider
          value={[fontSize]}
          onValueChange={(value) => setFontSize(value[0])}
          min={12}
          max={72}
          step={1}
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-1 justify-between">
        <div className="flex rounded-lg border p-1">
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 ${textAlign === "left" ? "bg-muted" : ""}`}
            onClick={() => setTextAlign("left")}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 ${textAlign === "center" ? "bg-muted" : ""}`}
            onClick={() => setTextAlign("center")}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`px-2 ${textAlign === "right" ? "bg-muted" : ""}`}
            onClick={() => setTextAlign("right")}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex rounded-lg border p-1 ml-1 justify-between px-2">
          <Button
            variant="ghost"
            size="sm"
            className={`px-3 ${isBold ? "bg-muted" : ""}`}
            onClick={() => setIsBold(!isBold)}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`px-3 ${isItalic ? "bg-muted" : ""}`}
            onClick={() => setIsItalic(!isItalic)}
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}