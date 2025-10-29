import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_PROMPT } from "@/lib/constant";
import { Settings } from "lucide-react";
import toast from "react-hot-toast";

interface SettingPanelProps {
  openAIApiKey: string;
  setOpenAIApiKey: React.Dispatch<React.SetStateAction<string>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

export default function SettingPanel({
  openAIApiKey,
  setOpenAIApiKey,
  prompt,
  setPrompt,
}: SettingPanelProps) {
  function handleSave() {
    if (prompt.length === 0) {
      alert("Please enter your PROMPT.");
      return;
    }
    if (openAIApiKey.length === 0) {
      alert("Please enter your API KEY.");
      return;
    }

    localStorage.setItem("openAIApiKey", openAIApiKey);
    localStorage.setItem("prompt", prompt);
    toast.success("Save successful!");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="select-none">Settings</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2">
          <div className="grid w-full max-w-sm items-center gap-3 mb-5">
            <Label htmlFor="email">PROMPT</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button variant="ghost" onClick={() => setPrompt(DEFAULT_PROMPT)}>
              Reset
            </Button>
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="email">OEPNAI&apos;s API KEY</Label>
            <Input
              type="password"
              autoFocus={false}
              value={openAIApiKey}
              onChange={(e) => setOpenAIApiKey(e.target.value)}
            />
          </div>
          <a
            target="_blank"
            href="https://platform.openai.com/api-keys"
            className="underline text-gray-400 text-xs"
          >
            Get an API key
          </a>
          <span className="text-gray-500 text-xs">
            Your API key is only stored in your browser.
          </span>
          <div className="flex flex-row-reverse">
            <Button variant="outline" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
