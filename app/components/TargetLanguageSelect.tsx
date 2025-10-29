import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "@/type/Languages";
import { SetStateAction } from "react";
interface TargetLanguageSelectProps {
  targetLanguage: string;
  setTargetLanguage: React.Dispatch<SetStateAction<string>>;
}

export default function TargetLanguageSelect({
  targetLanguage,
  setTargetLanguage,
}: TargetLanguageSelectProps) {
  function handleTargetLanguageChange(language: string) {
    setTargetLanguage(language);
    localStorage.setItem("targetLanguage", language);
  }

  return (
    <Select
      onValueChange={(language) => handleTargetLanguageChange(language)}
      defaultValue={targetLanguage}
    >
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Languages.map((language) => (
            <SelectItem key={language} value={language}>
              {language}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
