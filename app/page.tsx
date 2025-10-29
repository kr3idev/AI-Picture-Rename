"use client";

import JSZip from "jszip";
import { saveAs } from "file-saver";

import DropZone from "./components/DropZone";
import { Button } from "@/components/ui/button";
import React, { useState, useRef, useMemo } from "react";
import ImageTask from "@/type/ImageTask";
import toast from "react-hot-toast";

import OpenAI from "openai";
import ImageTaskTable from "./components/ImageTaskTable";
import { Label } from "@/components/ui/label";
import { GithubFavicon } from "./components/GithubFavicon";
import SettingPanel from "./components/SettingPanel";
import TargetLanguageSelect from "./components/TargetLanguageSelect";
import { DEFAULT_PROMPT, PROJECT_URL } from "@/lib/constant";

export default function Home() {
  const [imageTasks, setImageTasks] = useState<ImageTask[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("targetLanguage") ?? "English";
    }
    return "English";
  });
  const [openAIApiKey, setOpenAIApiKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("openAIApiKey") ?? "";
    }
    return "";
  });
  const [prompt, setPrompt] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("prompt") ?? DEFAULT_PROMPT;
    }
    return DEFAULT_PROMPT;
  });

  const isGenerating = useMemo(
    () => imageTasks.some((e) => e.isLoading),
    [imageTasks],
  );

  const hasNewNames = useMemo(
    () => imageTasks.some((e) => e.newName),
    [imageTasks],
  );
  const fileNames = useMemo(
    () => new Set<string>(imageTasks.map((image) => image.file.name)),
    [imageTasks],
  );

  function handleClearTapped() {
    setImageTasks([]);
  }
  function handleGenerateTapped() {
    imageTasks.forEach((task) => generate(task));
  }
  async function generate(task: ImageTask) {
    const apiKey = localStorage.getItem("openAIApiKey");
    const prompt = localStorage.getItem("prompt");
    const targetLanguage = localStorage.getItem("targetLanguage");
    if (!targetLanguage || targetLanguage.length === 0) {
      toast.error("Please set target language!");
      return;
    }
    if (!apiKey || apiKey.length === 0) {
      toast.error("Please set apiKey!");
      return;
    }
    if (!prompt || prompt.length === 0) {
      toast.error("Please set prompt!");
      return;
    }

    const client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    // Convert File to Base64
    const toBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    // Set loading state
    setImageTasks((prev) =>
      prev.map((img) =>
        img.file.name === task.file.name ? { ...img, isLoading: true } : img,
      ),
    );

    try {
      const base64 = await toBase64(task.file);
      const completion = await client.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt.replace("${targetLanguage}", targetLanguage),
              },
              {
                type: "image_url",
                image_url: { url: base64 },
              },
            ],
          },
        ],
      });

      const newName = completion.choices[0]?.message?.content?.trim() || "";

      setImageTasks((prev) =>
        prev.map((img) =>
          img.file.name === task.file.name
            ? { ...img, newName, isLoading: false }
            : img,
        ),
      );
    } catch (err) {
      console.error(err);
      toast.error(`An error occurred during generation: ${err}`);
      setImageTasks((prev) =>
        prev.map((img) =>
          img.file.name === task.file.name ? { ...img, isLoading: false } : img,
        ),
      );
    }
  }
  function handleOutput() {
    if (imageTasks.length === 0) {
      toast.error("No image");
      return;
    }

    const zip = new JSZip();
    imageTasks.forEach((img) => {
      const newName = img.newName?.trim() || img.file.name;
      zip.file(`${newName}${getExtension(img.file.name)}`, img.file);
    });

    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "renamed_imageTasks.zip");
      toast.success("The ZIP file was output.");
    });
  }

  function getExtension(filename: string) {
    const parts = filename.split(".");
    return parts.length > 1 ? `.${parts.pop()}` : "";
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files: FileList | null = e.target.files;
    if (!files || files.length == 0) return;

    toast.success("Import successful!");

    setImageTasks((prev) => [
      ...prev,
      ...Array.from(files)
        .filter(
          (file) => file.type.startsWith("image/") && !fileNames.has(file.name),
        )
        .map((file) => new ImageTask(file)),
    ]);
  }

  return (
    <div className="h-dvh flex flex-col gap-2 p-2">
      <div className="flex justify-between">
        {imageTasks.length > 0 ? (
          <div className="flex gap-2">
            <Button onClick={handleClearTapped}>Clear</Button>
            <Button onClick={() => inputRef.current?.click()}>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleInputChange}
                className="hidden"
              />
              Add
            </Button>
            <span className="p-2"></span>
            <Button
              disabled={isGenerating}
              variant="outline"
              onClick={handleGenerateTapped}
            >
              Generate a new name
            </Button>
            <Button
              disabled={isGenerating || !hasNewNames}
              variant="outline"
              onClick={handleOutput}
            >
              Save
            </Button>
          </div>
        ) : (
          <span />
        )}
        <div className="flex gap-2 items-center">
          <Label>Target language</Label>
          <TargetLanguageSelect
            targetLanguage={targetLanguage}
            setTargetLanguage={setTargetLanguage}
          />
          <SettingPanel
            openAIApiKey={openAIApiKey}
            setOpenAIApiKey={setOpenAIApiKey}
            prompt={prompt}
            setPrompt={setPrompt}
          />
          <a href={PROJECT_URL} target="_blank">
            <GithubFavicon />
          </a>
        </div>
      </div>
      <div className="w-full h-full">
        {imageTasks.length > 0 ? (
          <ImageTaskTable
            imageTasks={imageTasks}
            setImageTasks={setImageTasks}
          />
        ) : (
          <DropZone setImageTasks={setImageTasks} />
        )}
      </div>
    </div>
  );
}
